// Baut den Lernpfad im Fokus-Format nach dist/lernpfad/ (nach `vite build`).
// Je Kapitel lernpfad/kapitel/kNN/ (meta.json, kapitel.js, inhalt.tsx, mitnehmen.tsx, optional bausteine.tsx):
//   daten.js     JSON-fähige Exporte aus src/chapter/sNN/content.ts (window.KDATEN)
//   verstehen.js React-Bündel: Verstehen, Mitnehmen, Bausteine (Atlas-Komponenten, Werkstatt durch Code-Block ersetzt)
//   index.html   aus lernpfad/engine/index.html
// Aufruf: node scripts/build-lernpfad.mjs [k04 k05 …]   (ohne Angabe: alle Kapitel)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lp = path.join(root, 'lernpfad');
const ziel = path.join(root, 'dist', 'lernpfad');
const V = Date.now().toString(36);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const alle = fs.readdirSync(path.join(lp, 'kapitel')).filter(d => /^k\d\d$/.test(d) && fs.existsSync(path.join(lp, 'kapitel', d, 'meta.json'))).sort();
const gewuenscht = process.argv.slice(2).filter(a => /^k\d\d$/.test(a));
const kapitel = gewuenscht.length ? gewuenscht : alle;

// Sitzungen für die linke Leiste (Titel aus dem Lehrplan); nur Kapitel, die es schon gibt, sind Links.
const sitzungen = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', '-e',
  "import('./src/domain/curriculum.ts').then(m => process.stdout.write(JSON.stringify(m.sessions.map(s => ({ id: s.id, title: s.title })))))"], { cwd: root, encoding: 'utf8' }));

fs.mkdirSync(path.join(ziel, 'engine'), { recursive: true });
for (const f of ['stil.css', 'engine.js', 'hilfe.js', 'tasten.js', 'umgebung.js']) fs.copyFileSync(path.join(lp, 'engine', f), path.join(ziel, 'engine', f));
// Einstieg: zum zuletzt besuchten Kapitel, sonst zum ersten.
fs.writeFileSync(path.join(ziel, 'index.html'), `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Lernpfad – Statistikatlas</title>
<script>var k='${alle[0]}';try{var l=localStorage.getItem('lernpfad-letzte');if(l&&/^k\\d\\d$/.test(l))k=l;}catch(e){}location.replace(k+'/');</script></head>
<body><p><a href="${alle[0]}/">Zum Lernpfad</a></p></body></html>`);

const vorlage = fs.readFileSync(path.join(lp, 'engine', 'index.html'), 'utf8');

for (const k of kapitel) {
  const ordner = path.join(lp, 'kapitel', k);
  const meta = JSON.parse(fs.readFileSync(path.join(ordner, 'meta.json'), 'utf8'));
  const aus = path.join(ziel, k);
  fs.mkdirSync(aus, { recursive: true });
  console.log(`Lernpfad ${k}: ${meta.titel}`);

  // 1. Daten
  const json = execFileSync(process.execPath, ['--import', 'tsx', path.join(root, 'scripts', 'lernpfad-daten.ts'), meta.content], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  fs.writeFileSync(path.join(aus, 'daten.js'), `window.KDATEN = ${json};\n`);
  fs.copyFileSync(path.join(ordner, 'kapitel.js'), path.join(aus, 'kapitel.js'));

  // 2. React-Bündel
  const chapterDir = path.join(root, 'src', 'chapter', meta.content);
  const bausteine = fs.existsSync(path.join(ordner, 'bausteine.tsx')) ? path.join(ordner, 'bausteine.tsx') : path.join(lp, 'react', 'keine-bausteine.ts');
  const werkstattErsatz = {
    name: 'werkstatt-ersatz', enforce: 'pre',
    resolveId(src, importer) {
      if (importer && importer.startsWith(chapterDir) && /^\.\.?\/(Workshop|.*\/Workshop)$/.test(src) && !importer.endsWith('Workshop.tsx')) return path.join(lp, 'react', 'Workshop.tsx');
      if (importer && /\/workshop\/CodeWorkshop$/.test(src)) return path.join(lp, 'react', 'CodeWorkshopErsatz.tsx');
    },
  };
  const textErsatz = {
    name: 'text-ersatz', enforce: 'pre',
    transform(code, id) {
      if (!id.startsWith(chapterDir) || !meta.ersetzungen?.length) return;
      let out = code; for (const [a, b] of meta.ersetzungen) out = out.split(a).join(b);
      return out === code ? undefined : out;
    },
  };
  await build({
    configFile: false, root: lp, logLevel: 'warn',
    plugins: [werkstattErsatz, textErsatz, react()],
    define: { 'process.env.NODE_ENV': '"production"' },
    resolve: {
      alias: [
        { find: '@kapitel/bausteine', replacement: bausteine },
        { find: '@kapitel', replacement: ordner },
        { find: '@content', replacement: path.join(chapterDir, 'content.ts') },
        { find: '@lernpfad', replacement: path.join(lp, 'react') },
        { find: '@atlas', replacement: path.join(root, 'src') },
      ],
    },
    build: {
      outDir: aus, emptyOutDir: false, minify: true, sourcemap: false, copyPublicDir: false,
      lib: { entry: path.join(lp, 'react', 'entry.tsx'), formats: ['iife'], name: 'Lernpfad' + k, fileName: () => 'verstehen.js', cssFileName: 'verstehen' },
    },
  });

  // 3. Seite
  const nr = meta.nr;
  const html = vorlage
    .replaceAll('{{SITZUNGEN}}', sitzungen.map(s => {
      const kk = 'k' + String(s.id).padStart(2, '0'), da = alle.includes(kk);
      const inhalt = `<span class="st s c${s.id}">${s.id}</span>${esc(s.title)}`;
      return s.id === nr ? `      <li class="jetzt" aria-current="page">${inhalt}</li>` : da ? `      <li><a href="../${kk}/">${inhalt}</a></li>` : `      <li class="spaeter">${inhalt}</li>`;
    }).join('\n'))
    .replaceAll('{{ZIELE}}', meta.ziele.map(z => `          <li>${z}</li>`).join('\n'))
    .replaceAll('{{BEKANNT}}', meta.bekannt || '–')
    .replaceAll('{{LEITFRAGE}}', esc(meta.leitfrage))
    .replaceAll('{{TITEL}}', esc(meta.titel))
    .replaceAll('{{NR}}', String(nr))
    .replaceAll('{{META}}', JSON.stringify({ nr, titel: meta.titel, kapitel: k }).replace(/</g, '\\u003c'))
    .replaceAll('{{V}}', V);
  fs.writeFileSync(path.join(aus, 'index.html'), html);
}
console.log(`Lernpfad gebaut: ${kapitel.join(', ')} → dist/lernpfad/`);
