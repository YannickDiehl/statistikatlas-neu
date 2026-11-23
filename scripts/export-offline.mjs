import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
let html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)];
// Nachgeladene Teile (dynamisches import(), etwa die in R erfassten Katalogausgaben) als data:-Adresse einbetten,
// damit sie auch aus der einzelnen HTML-Datei (file://) laden. Die Teile dürfen selbst nichts weiter importieren.
async function inlineChunks(source, dir) {
  let out = source;
  for (const m of source.matchAll(/import\(\s*([`'"])\.\/([\w.-]+\.js)\1\s*\)/g)) {
    const chunk = (await fs.readFile(path.join(dir, m[2]), 'utf8')).replace(/\/\/# sourceMappingURL=.*$/gm, '');
    if (/\bimport\b[\s\S]*?from\s*['"`]/.test(chunk)) throw new Error(`export-offline: ${m[2]} importiert weitere Teile und lässt sich so nicht einbetten.`);
    out = out.split(m[0]).join(`import(${m[1]}data:text/javascript;base64,${Buffer.from(chunk).toString('base64')}${m[1]})`);
  }
  return out;
}
for (const match of scripts) {
  const file = path.join(dist, match[1]);
  const source = await inlineChunks(await fs.readFile(file, 'utf8'), path.dirname(file));
  const safe = source.replace(/\/\/# sourceMappingURL=.*$/gm, '').replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], () => `<script type="module">${safe}</script>`);
}
// Schriften: In jeder @font-face-Regel bleibt nur die woff2-Quelle, als data:-Adresse eingebettet,
// damit die einzelne HTML-Datei auch ohne den assets-Ordner die Lernpfad-Schriften zeigt.
async function inlineFonts(css, dir) {
  const faces = [...css.matchAll(/src:((?:\s*url\([^)]+\)\s*format\("[^"]+"\)\s*,?)+)/g)];
  let out = css;
  for (const face of faces) {
    const sources = [...face[1].matchAll(/url\(([^)]+)\)\s*format\("([^"]+)"\)/g)].filter(m => m[2] === 'woff2');
    if (!sources.length) continue;
    const parts = [];
    for (const [, url] of sources) {
      if (url.startsWith('data:')) { parts.push(`url(${url})format("woff2")`); continue; }
      const font = await fs.readFile(path.join(dir, url));
      parts.push(`url(data:font/woff2;base64,${font.toString('base64')})format("woff2")`);
    }
    out = out.replace(face[0], () => `src:${parts.join(',')}`);
  }
  if (/url\(\.\/[^)]+\.woff2?\)/.test(out)) throw new Error('export-offline: Eine Schrift verweist noch auf eine Datei im assets-Ordner.');
  return out;
}
const sheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
for (const match of sheets) {
  const file = path.join(dist, match[1]);
  const css = await inlineFonts(await fs.readFile(file, 'utf8'), path.dirname(file));
  html = html.replace(match[0], () => `<style>${css}</style>`);
}
await fs.writeFile(path.join(root, 'Statistikatlas-Prototyp.html'), html);
await fs.writeFile(path.join(dist, 'Statistikatlas-offline.html'), html);
console.log(`Offline-Prototyp erstellt: ${Math.round(Buffer.byteLength(html)/1024)} KB, alle Skripte, Stile und Schriften eingebettet.`);
