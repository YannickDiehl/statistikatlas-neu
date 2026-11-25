// Vergleicht die denk-Fenster jedes Kapitels (Fachbegriff-Fenster mit Zusatzinfos) mit Fragen, Optionen,
// Rückmeldungen und Hinweisen aus dist/lernpfad/kNN/daten.js (vorher bauen: node scripts/build-lernpfad.mjs).
// Zusätzlich gelten „fach“ und „kurz“ der in meta.begriffe gelisteten Einträge als Quelle „Antipp“.
// Meldet gemeinsame Wortfolgen ab N Wörtern; Marken ⟪Text|id⟫ zählen mit ihrem Text.
// Aufruf: node scripts/lernpfad-ueberlappung.mjs <repo> [N=6] [kNN …]
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const repo = process.argv[2];
const N = +(process.argv[3] || 6);
const gewuenscht = process.argv.slice(4).filter(a => /^k\d\d$/.test(a));
const plain = s => String(s).replace(/⟪([^⟪⟫|\n]+)(?:\|[a-z0-9-]+)?⟫/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
  .toLowerCase().replace(/[„“”"'‚‘’`.,:;!?()\[\]{}…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
const grams = s => { const w = plain(s).split(' ').filter(Boolean); const out = new Set(); for (let i = 0; i + N <= w.length; i++) out.add(w.slice(i, i + N).join(' ')); return out; };
const strings = (x, pfad, out) => {
  if (typeof x === 'string') { out.push([pfad, x]); return out; }
  if (Array.isArray(x)) x.forEach((v, i) => strings(v, pfad + '[' + i + ']', out));
  else if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) strings(v, pfad + '.' + k, out);
  return out;
};

const verz = JSON.parse(fs.readFileSync(path.join(repo, 'lernpfad/begriffe.json'), 'utf8'));
for (const k of fs.readdirSync(path.join(repo, 'lernpfad/kapitel')).filter(d => /^k\d\d$/.test(d) && (!gewuenscht.length || gewuenscht.includes(d))).sort()) {
  const daten = fs.readFileSync(path.join(repo, 'dist/lernpfad', k, 'daten.js'), 'utf8');
  const sandbox = { window: {}, document: { querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, getElementById: () => null, createElement: () => ({}) }, console };
  sandbox.window.document = sandbox.document;
  vm.createContext(sandbox);
  vm.runInContext(daten, sandbox);
  const D = sandbox.window.KDATEN;
  // Antwortquellen: alles außer Bildern und Vorlagen
  const quellen = [];
  for (const [key, v] of Object.entries(D)) {
    if (/^(SVG|ALT|TEMPLATES|BILD|SCRIPT)/.test(key)) continue;
    if (/QUESTION|HINT|PREDICTION|RESOLUTION|SPECIAL|AXIS|MODEL|FEEDBACK|SELF|ANSWER|^A\d/i.test(key)) strings(v, key, quellen);
  }
  const fenster = [];
  const denk = (label, o) => { fenster.push({ label, o }); return { art: 'warum', label, denk: o }; };
  const stub = () => ({ art: 'x' });
  vm.runInContext(fs.readFileSync(path.join(repo, 'lernpfad/kapitel', k, 'kapitel.js'), 'utf8'), sandbox);
  try {
    sandbox.window.KAPITEL({ D, T: D.TEMPLATES || {}, esc: s => String(s), codeHtml: s => String(s), bild: stub, warum: stub, probier: stub, denk });
  } catch (e) { console.log(`${k}: KAPITEL() warf ${e.message}`); }
  // Antipp-Texte der Begriffe dieses Kapitels sind ebenfalls Quellen für Doppelungen mit den Antworten.
  const meta = JSON.parse(fs.readFileSync(path.join(repo, 'lernpfad/kapitel', k, 'meta.json'), 'utf8'));
  const antipp = [];
  for (const id of meta.begriffe || []) for (const feld of ['fach', 'kurz']) if (verz[id]?.[feld]) antipp.push([`Antipp ${id}.${feld}`, verz[id][feld]]);
  const qGrams = quellen.map(([p, s]) => [p, s, grams(s)]);
  const aGrams = antipp.map(([p, s]) => [p, s, grams(s)]);
  let treffer = 0;
  // Antipp-Texte gegen die Antworttexte
  for (const [ap, as, ag] of aGrams) for (const [p, s, qg] of qGrams) {
    const gemeinsam = [...ag].filter(x => qg.has(x));
    if (gemeinsam.length) { treffer++; console.log(`${k} | ${ap} ~ ${p}\n    gemeinsam: „${gemeinsam[0]}“${gemeinsam.length > 1 ? ` (+${gemeinsam.length - 1})` : ''}\n    Quelle: ${plain(s).slice(0, 160)}`); }
  }
  for (const { label, o } of fenster) {
    const teile = { label, kurz: o.kurz, denken: (o.denken || []).join(' | '), verwechslung: o.verwechslung, zusatz: o.zusatz, bildtext: o.bildtext };
    for (const [feld, text] of Object.entries(teile)) {
      if (!text) continue;
      const g = grams(text);
      for (const [p, s, qg] of qGrams) {
        const gemeinsam = [...g].filter(x => qg.has(x));
        if (gemeinsam.length) { treffer++; console.log(`${k} | ${label} | ${feld} ~ ${p}\n    gemeinsam: „${gemeinsam[0]}“${gemeinsam.length > 1 ? ` (+${gemeinsam.length - 1})` : ''}\n    Quelle: ${plain(s).slice(0, 160)}`); }
      }
    }
  }
  console.log(`== ${k}: ${fenster.length} Fenster, ${antipp.length} Antipp-Texte, ${quellen.length} Antworttexte, ${treffer} Treffer`);
}
