// Prüft das Fachbegriff-Verzeichnis (lernpfad/begriffe.json) und die Marken ⟪Text|id⟫ / ⟪Name⟫ in den Kapiteln.
// Aufruf: node scripts/begriffe-pruefen.mjs [--streng] [kNN …]
//   Fehler  (Exit 1): Eintrag ohne name/fach/kurz/kapitel; karte ohne passende Karte in kNN/inhalt.tsx; kurz mit mehr als 2 Sätzen; unbekannte id in Marke,
//                     <Begriff id> oder meta.begriffe; Marke in Backticks, <code>, <pre>, über HTML-Tags hinweg
//                     oder in den Daten-Schlüsseln SVG/ALT/TEMPLATES/SCRIPT
//                     und im BILD-Objekt von kapitel.js (Bildunterschriften der Verstehen-Seite, dort werden Marken nicht umgewandelt).
//   Warnung (mit --streng Exit 1): id aus meta.begriffe im Kapitel nirgends markiert; Zeichenkette mit einem
//                     bild-Wort, aber ohne Namen, Alias oder Marke desselben Begriffs.
// ⟦…⟧ (Platzhalter der Code-Werkstatt) ist etwas anderes und wird nie beanstandet.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { register } from 'tsx/esm/api';

register();
const { MARKE, aufloesen } = await import('../src/lib/begriffe.ts');
const { sentences } = await import('../src/explain/style.ts');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BILDER = /^(SVG|ALT|TEMPLATES|SCRIPT)$/;

const marken = text => [...String(text).matchAll(new RegExp(MARKE.source, 'g'))]
  .map(m => ({ text: m[1], id: m[2], index: m.index, laenge: m[0].length }));

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wort = (w, text) => new RegExp(`(?<![\\p{L}\\p{N}])${esc(w)}(?![\\p{L}\\p{N}])`, 'u').test(text);

/**
 * Ziele von Verstehen.zeige(id) in einem inhalt.tsx. Drei Formen kommen vor:
 *  - JSX-Anker id="…" (Karten und Abschnitte im Text),
 *  - Themen in THEMEN: id: '…',
 *  - Karten-Paare in karten: [['id', 'Titel'], …] (die rechte Leiste; zeige() findet das Thema darüber).
 */
export function kartenIds(code) {
  const text = String(code), ids = new Set();
  for (const m of text.matchAll(/\bid\s*[=:]\s*\{?\s*["'`]([A-Za-z0-9_-]+)["'`]/g)) ids.add(m[1]);
  for (const m of text.matchAll(/\bkarten\s*:\s*\[/g)) {
    let tiefe = 1, i = m.index + m[0].length;
    const start = i;
    for (; i < text.length && tiefe > 0; i++) { if (text[i] === '[') tiefe++; else if (text[i] === ']') tiefe--; }
    for (const p of text.slice(start, i).matchAll(/\[\s*["'`]([A-Za-z0-9_-]+)["'`]\s*,/g)) ids.add(p[1]);
  }
  return ids;
}

/** Einträge des Verzeichnisses: Pflichtfelder und Länge von kurz; mit kartenVon(nr) → Quelltext oder null auch `karte`. */
export function pruefeEintraege(verz, kartenVon) {
  const f = [];
  for (const [id, e] of Object.entries(verz)) {
    for (const feld of ['name', 'fach', 'kurz', 'kapitel']) {
      if (e[feld] === undefined || e[feld] === null || e[feld] === '') f.push({ stufe: 'Fehler', ort: `begriffe.json ${id}`, text: `Feld „${feld}“ fehlt` });
    }
    for (const feld of ['name', 'fach', 'kurz', 'bild', 'alias']) {
      for (const t of [].concat(e[feld] ?? [])) {
        if (typeof t === 'string' && marken(t).length) f.push({ stufe: 'Fehler', ort: `begriffe.json ${id}`, text: `Marke im Feld „${feld}“ (Verzeichnistexte vertragen keine Marken)` });
      }
    }
    if (typeof e.kurz === 'string' && sentences(e.kurz).length > 2) f.push({ stufe: 'Fehler', ort: `begriffe.json ${id}`, text: `„kurz“ hat ${sentences(e.kurz).length} Sätze (erlaubt: 2)` });
    if (e.karte !== undefined && e.karte !== null && e.karte !== '' && kartenVon) {
      const m = /^(?:k(\d{1,2}):)?([A-Za-z0-9_-]+)$/.exec(String(e.karte));
      if (!m) { f.push({ stufe: 'Fehler', ort: `begriffe.json ${id}`, text: `„karte“ „${e.karte}“ hat kein Format „id“ oder „kNN:id“` }); continue; }
      const nr = m[1] ? Number(m[1]) : e.kapitel;
      const code = kartenVon(nr);
      if (code === null || code === undefined) f.push({ stufe: 'Fehler', ort: `begriffe.json ${id}`, text: `„karte“ „${e.karte}“: Kapitel k${String(nr).padStart(2, '0')} oder dessen inhalt.tsx fehlt` });
      else if (!kartenIds(code).has(m[2])) f.push({ stufe: 'Fehler', ort: `begriffe.json ${id}`, text: `„karte“ „${e.karte}“: Karte „${m[2]}“ steht nicht in k${String(nr).padStart(2, '0')}/inhalt.tsx` });
    }
  }
  return f;
}

/**
 * Eine Zeichenkette (oder Quelltext) auf Marken prüfen.
 * opt.verbot: Marken sind hier grundsätzlich verboten (Daten-Schlüssel SVG/ALT/TEMPLATES/SCRIPT).
 * opt.quelltext: Datei statt einzelner Zeichenkette; Backticks sind dort meist Template-Literale.
 * opt.begriffe: ids, deren bild-Wörter beobachtet werden. Gibt { funde, benutzt } zurück.
 */
export function pruefeText(text, verz, ort, opt = {}) {
  const funde = [];
  const benutzt = new Set();
  const fehler = t => funde.push({ stufe: 'Fehler', ort, text: t });
  const alle = marken(text);
  for (const m of alle) {
    const roh = `⟪${m.text}${m.id ? '|' + m.id : ''}⟫`;
    if (opt.verbot) { fehler(`Marke ${roh} in einem Daten-Schlüssel, der keine Marken verträgt`); continue; }
    const id = aufloesen(m.text, m.id, verz);
    if (!id) { fehler(`unbekannter Begriff in ${roh}`); continue; }
    benutzt.add(id);
    if (/[<>]/.test(m.text)) fehler(`Marke ${roh} umschließt HTML-Tags`);
    const vor = text.slice(0, m.index), nach = text.slice(m.index + m.laenge);
    const inCode = (/<code[^>]*>(?:(?!<\/code>)[\s\S])*$/.test(vor) && /^(?:(?!<code[ >])[\s\S])*?<\/code>/.test(nach))
      || (/<pre[^>]*>(?:(?!<\/pre>)[\s\S])*$/.test(vor) && /^(?:(?!<pre[ >])[\s\S])*?<\/pre>/.test(nach));
    if (inCode) fehler(`Marke ${roh} in <code>/<pre>`);
    // Backticks: in Daten-Zeichenketten bedeutet ein ungerades Vorkommen davor „innerhalb von `…`“;
    // im Quelltext nur dieselbe Zeile und kurze Spanne ohne Leerzeichen am Rand (Inline-Code, kein Template-Literal).
    const zeile = vor.slice(vor.lastIndexOf('\n') + 1);
    const zeileNach = nach.split('\n')[0];
    // Backticks der Zeile von links nach rechts paaren: nur bei ungerader Zahl davor steht die Marke in einem Paar.
    const inBackticks = opt.quelltext
      ? (zeile.match(/`/g) ?? []).length % 2 === 1 && /`[^`]{0,60}$/.test(zeile) && /^[^`]{0,60}`/.test(zeileNach) && !/(?:[=(,:?&|]|=>|\breturn|\bin|^)\s*$|\$\{[^}]*$/.test(zeile.slice(0, zeile.lastIndexOf('`')))
      : ((vor.match(/`/g) ?? []).length % 2 === 1 && nach.includes('`'));
    if (inBackticks) fehler(`Marke ${roh} in Backticks`);
  }
  for (const id of opt.begriffe ?? []) {
    const e = verz[id];
    if (!e?.bild?.length || benutzt.has(id)) continue;
    const bildWort = e.bild.find(b => wort(b, text));
    if (!bildWort) continue;
    const genannt = [e.name, ...(e.alias ?? [])].some(n => wort(n, text));
    if (!genannt) funde.push({ stufe: 'Warnung', ort, text: `Bildwort „${bildWort}“ ohne Fachbegriff „${e.name}“ in derselben Zeichenkette` });
  }
  return { funde, benutzt };
}

/** Quelltext (ts/tsx/js): Marken, <Begriff id>, Zeichenketten mit Bildwörtern. */
export function pruefeQuelle(code, verz, datei, begriffe = []) {
  const { funde, benutzt } = pruefeText(code, verz, datei, { quelltext: true });
  for (const m of code.matchAll(/<Begriff\s+id=(?:["']([^"']+)["']|\{\s*["']([^"']+)["']\s*\})/g)) {
    const id = m[1] ?? m[2];
    if (Object.hasOwn(verz, id)) benutzt.add(id);
    else funde.push({ stufe: 'Fehler', ort: datei, text: `unbekannte id in <Begriff id="${id}">` });
  }
  // Titel von Aufgaben und Schritten (kapitel.js u. a.) vertragen keine Marken.
  for (const m of code.matchAll(/\b(?:titel|title)\s*:\s*(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) {
    if (marken(m[2]).length) funde.push({ stufe: 'Fehler', ort: datei, text: `Marke im Titel „${m[2]}“` });
  }
  // BILD in kapitel.js: Bildunterschriften der Verstehen-Seite; die Engine wandelt dort keine Marken um.
  if (/(^|[\/ ])kapitel\.js$/.test(datei)) {
    const b = /\bconst\s+BILD\s*=\s*\{/.exec(code);
    if (b) {
      let tiefe = 1, i = b.index + b[0].length, q = null;
      const start = i;
      for (; i < code.length && tiefe > 0; i++) {
        const c = code[i];
        if (q) { if (c === '\\') i++; else if (c === q) q = null; }
        else if (c === "'" || c === '"' || c === '`') q = c;
        else if (c === '{') tiefe++;
        else if (c === '}') tiefe--;
      }
      for (const m of marken(code.slice(start, i))) funde.push({ stufe: 'Fehler', ort: datei, text: `Marke ⟪${m.text}${m.id ? '|' + m.id : ''}⟫ in BILD (Bildunterschrift ohne Markenumwandlung)` });
    }
  }
  // content.ts und bilder/index.ts werden zusätzlich als Daten geprüft; dort zählen Bildwörter nur einmal.
  if (/\/(content\.ts|bilder\/index\.ts)$/.test(datei)) return { funde, benutzt };
  for (const m of code.matchAll(/'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
    const s = m[1] ?? m[2] ?? m[3];
    funde.push(...pruefeText(s, verz, datei, { begriffe }).funde.filter(f => f.stufe === 'Warnung'));
  }
  return { funde, benutzt };
}

/** Alle Zeichenketten eines JSON-Baums mit Schlüsselpfad. */
function zeichenketten(x, pfad, out = []) {
  if (typeof x === 'string') out.push([pfad, x]);
  else if (Array.isArray(x)) x.forEach((v, i) => zeichenketten(v, `${pfad}[${i}]`, out));
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) zeichenketten(v, pfad ? `${pfad}.${k}` : k, out);
  return out;
}

/** Daten eines Kapitels (SVG, ALT, TEMPLATES und alles andere aus content.ts). */
export function pruefeDaten(daten, verz, k, begriffe = []) {
  const funde = [], benutzt = new Set();
  for (const [key, wert] of Object.entries(daten)) {
    for (const [pfad, s] of zeichenketten(wert, key)) {
      // Interne Kennungen (value, target, match, id) liest niemand als Text: kein Bildwort-Hinweis, Marken sind dort Fehler.
      const intern = /(^|\.)(value|target|match|id)(\[\d+\])*$/.test(pfad) || /^PREDICTIONS\b.*\.options(\[\d+\])*$/.test(pfad);
      const r = pruefeText(s, verz, `${k} daten ${pfad}`, { verbot: BILDER.test(key) || intern || /(^|\.)(titel|title)$/.test(pfad), begriffe: intern || /^(SVG|TEMPLATES|SCRIPT)$/.test(key) ? [] : begriffe });
      funde.push(...r.funde); r.benutzt.forEach(i => benutzt.add(i));
    }
  }
  return { funde, benutzt };
}

function dateien(ordner, endung) {
  if (!fs.existsSync(ordner)) return [];
  return fs.readdirSync(ordner, { withFileTypes: true }).flatMap(d => {
    const p = path.join(ordner, d.name);
    if (d.isDirectory()) return dateien(p, endung);
    return endung.test(d.name) && !/\.test\./.test(d.name) ? [p] : [];
  });
}

/** Kern der Kapitelprüfung ohne Dateizugriff: kap = { k, meta, quellen: [{ name, code }], daten }. */
export function pruefeKapitelInhalt(kap, verz) {
  const { k, meta, quellen, daten } = kap;
  const ids = meta.begriffe ?? [];
  const bekannt = ids.filter(i => verz[i]);
  const funde = [], benutzt = new Set();
  for (const id of ids) if (!Object.hasOwn(verz, id)) funde.push({ stufe: 'Fehler', ort: `${k} meta.begriffe`, text: `unbekannte id „${id}“` });
  if (marken(meta.titel ?? '').length) funde.push({ stufe: 'Fehler', ort: `${k} meta.json`, text: `Marke im Titel „${meta.titel}“` });
  for (const q of quellen) {
    const r = pruefeQuelle(q.code, verz, `${k} ${q.name}`, bekannt);
    funde.push(...r.funde); r.benutzt.forEach(i => benutzt.add(i));
  }
  if (daten) {
    const r = pruefeDaten(daten, verz, k, bekannt);
    funde.push(...r.funde); r.benutzt.forEach(i => benutzt.add(i));
  }
  for (const id of bekannt) if (!benutzt.has(id)) funde.push({ stufe: 'Warnung', ort: `${k} meta.begriffe`, text: `„${id}“ ist im Kapitel nirgends markiert` });
  return funde;
}

/** Exit-Code: 1 bei Fehlern, mit streng auch bei Warnungen. */
export const exitCode = (funde, streng) => funde.some(f => f.stufe === 'Fehler') || (streng && funde.some(f => f.stufe === 'Warnung')) ? 1 : 0;

/** Ein Kapitel prüfen; liest Dateien und Daten und ruft pruefeKapitelInhalt. */
export function pruefeKapitel(k, verz) {
  const ordner = path.join(root, 'lernpfad', 'kapitel', k);
  const meta = JSON.parse(fs.readFileSync(path.join(ordner, 'meta.json'), 'utf8'));
  const dateienK = [...dateien(ordner, /\.(js|tsx)$/), ...dateien(path.join(root, 'src', 'chapter', meta.content ?? '-'), /\.(ts|tsx)$/)];
  const quellen = dateienK.map(d => ({ name: path.relative(root, d), code: fs.readFileSync(d, 'utf8') }));
  let daten = null;
  if (meta.content && fs.existsSync(path.join(root, 'src', 'chapter', meta.content, 'content.ts'))) {
    const json = execFileSync(process.execPath, ['--import', 'tsx', path.join(root, 'scripts', 'lernpfad-daten.ts'), meta.content], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    daten = JSON.parse(json);
  }
  return pruefeKapitelInhalt({ k, meta, quellen, daten }, verz);
}

function main() {
  const args = process.argv.slice(2);
  const streng = args.includes('--streng');
  const verz = JSON.parse(fs.readFileSync(path.join(root, 'lernpfad', 'begriffe.json'), 'utf8'));
  const alle = fs.readdirSync(path.join(root, 'lernpfad', 'kapitel')).filter(d => /^k\d\d$/.test(d) && fs.existsSync(path.join(root, 'lernpfad', 'kapitel', d, 'meta.json'))).sort();
  const gewuenscht = args.filter(a => /^k\d\d$/.test(a));
  const kartenVon = nr => {
    const d = path.join(root, 'lernpfad', 'kapitel', 'k' + String(nr).padStart(2, '0'), 'inhalt.tsx');
    return fs.existsSync(d) ? fs.readFileSync(d, 'utf8') : null;
  };
  const funde = pruefeEintraege(verz, kartenVon).map(f => ({ ...f, kapitel: '-' }));
  for (const k of gewuenscht.length ? gewuenscht : alle) funde.push(...pruefeKapitel(k, verz).map(f => ({ ...f, kapitel: k })));
  for (const f of funde) console.log(`${f.stufe}: ${f.ort}: ${f.text}`);
  const fe = funde.filter(f => f.stufe === 'Fehler').length, wa = funde.length - fe;
  const je = {};
  for (const f of funde.filter(x => x.stufe === 'Warnung')) je[f.kapitel] = (je[f.kapitel] ?? 0) + 1;
  console.log(`Begriffe: ${fe} Fehler, ${wa} Warnungen${wa ? ' (' + Object.entries(je).map(([k, n]) => `${k}: ${n}`).join(', ') + ')' : ''}`);
  if (exitCode(funde, streng)) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
