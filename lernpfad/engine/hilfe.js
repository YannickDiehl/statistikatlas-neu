/* Help (Pakete, Hilfeseiten, Vignetten) und Autovervollständigung wie in RStudio. Prototyp. */
'use strict';
const _e = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/** Hilfsrechnungen laufen in einer eigenen Umgebung, damit sie das Environment der Studierenden nicht verändern. */
async function rText(code) { const r = await R.w.evalR('local({\n' + code + '\n})'); const v = (await r.toJs()).values; return v; }

/* ---------- Help ---------- */
const Hilfe = {
  KERN: ['mariposa', 'dplyr', 'ggplot2', 'tidyr', 'haven', 'stats', 'base', 'utils'],
  pakete: [], aliase: [], verlauf: [], bereit: false,
  laden() { return this.ladeP || (this.ladeP = this._laden()); },
  async bereitMachen() { await R.hoch(); await this.laden(); },
  async _laden() {
    try {
      const p = await rText(`ip <- installed.packages(fields = "Title"); att <- sub("^package:", "", search()); paste(ip[, "Package"], ip[, "Version"], gsub("\\\\s+", " ", ip[, "Title"]), ip[, "Package"] %in% att, sep = "\\t")`);
      this.pakete = p.map(z => { const [name, version, titel, geladen] = z.split('\t'); return { name, version, titel, geladen: geladen === 'TRUE' }; });
      const a = await rText(`unlist(lapply(c(${this.KERN.map(k => `"${k}"`).join(',')}), function(p) { a <- readRDS(system.file("help", "aliases.rds", package = p)); paste(p, names(a), a, sep = "\\t") }))`);
      this.aliase = a.map(z => { const [pkg, alias, datei] = z.split('\t'); return { pkg, alias, datei }; });
      this.bereit = true; if (!this.verlauf.length) this.home(false);
    } catch (e) { $('#h-inhalt').innerHTML = `<p class="leer">Hilfe nicht verfügbar: ${_e(e.message)}</p>`; }
  },
  schritt(ansicht) { this.verlauf.push(ansicht); $('#h-zurueck').disabled = this.verlauf.length < 2; },
  zurueck() { if (this.verlauf.length < 2) return; this.verlauf.pop(); const a = this.verlauf.pop(); this[a.art](...a.args); },
  home(merken = true) {
    if (merken !== false) this.schritt({ art: 'home', args: [] }); else { this.verlauf = [{ art: 'home', args: [] }]; $('#h-zurueck').disabled = true; }
    const kern = this.pakete.filter(p => this.KERN.includes(p.name) && !['stats', 'base', 'utils'].includes(p.name));
    const rest = this.pakete.filter(p => !kern.includes(p));
    const zeile = p => `<tr><td><button type="button" class="h-link" data-paket="${_e(p.name)}">${_e(p.name)}</button></td><td>${_e(p.titel)}</td><td class="h-ver">${_e(p.version)}</td><td>${p.geladen ? '<span class="h-geladen" title="mit library() geladen">geladen</span>' : ''}</td></tr>`;
    $('#h-inhalt').innerHTML = `<h4 class="h-titel">Pakete</h4><p class="leer">Wie der Reiter „Packages“ in RStudio. Ein Klick zeigt Hilfeseiten und Vignetten.</p>
      <table class="h-tab"><tbody>${kern.map(zeile).join('')}</tbody></table>
      <details class="h-mehr"><summary>Alle ${rest.length} weiteren Pakete</summary><table class="h-tab"><tbody>${rest.map(zeile).join('')}</tbody></table></details>`;
  },
  async paket(name) {
    this.schritt({ art: 'paket', args: [name] });
    const box = $('#h-inhalt'); box.innerHTML = '<p class="leer">Lädt …</p>';
    const vig = await rText(`v <- vignette(package = "${name}")$results; if (nrow(v)) paste(v[, "Item"], sub(" \\\\(.*\\\\)$", "", v[, "Title"]), sep = "\\t") else character(0)`);
    let themen = this.aliase.filter(a => a.pkg === name);
    if (!themen.length) { const a = await rText(`a <- readRDS(system.file("help", "aliases.rds", package = "${name}")); paste(names(a), a, sep = "\\t")`); themen = a.map(z => { const [alias, datei] = z.split('\t'); return { pkg: name, alias, datei }; }); }
    const p = this.pakete.find(x => x.name === name);
    box.innerHTML = `<h4 class="h-titel">${_e(name)} <span class="h-ver">${_e(p?.version || '')}</span></h4><p>${_e(p?.titel || '')}</p>
      ${vig.length ? `<h5>Vignetten</h5><ul class="h-vig">${vig.map(z => { const [item, titel] = z.split('\t'); return `<li><button type="button" class="h-link" data-vig="${_e(name)}:${_e(item)}">${_e(titel)}</button></li>`; }).join('')}</ul>` : '<p class="leer">Keine Vignetten.</p>'}
      <h5>Hilfeseiten (${new Set(themen.map(t => t.datei)).size})</h5>
      <ul class="h-index">${[...new Map(themen.filter(t => !/[-.]package$/.test(t.datei) || true).map(t => [t.datei, t])).values()].sort((a, b) => a.datei.localeCompare(b.datei)).map(t => `<li><button type="button" class="h-link" data-thema="${_e(t.pkg)}:${_e(t.alias)}">${_e(t.datei)}</button></li>`).join('')}</ul>`;
  },
  frame(html) {
    const box = $('#h-inhalt'); box.innerHTML = '';
    const f = document.createElement('iframe'); f.className = 'h-frame'; f.title = 'Hilfeseite'; f.setAttribute('sandbox', 'allow-same-origin');
    f.srcdoc = html; box.append(f);
    f.onload = () => {
      const d = f.contentDocument; if (!d) return;
      d.addEventListener('click', ev => {
        const a = ev.target.closest('a'); if (!a) return;
        const h = a.getAttribute('href') || ''; ev.preventDefault();
        const m = h.match(/(?:\.\.\/\.\.\/([\w.]+)\/(?:help|html)\/)?([^/#]+?)(?:\.html)?(?:#.*)?$/);
        if (/^https?:/.test(h)) { window.open(h, '_blank', 'noopener'); return; }
        if (m) this.thema(m[2], m[1] || this.aktPaket);
      });
    };
  },
  STIL: `<style>body{font:15px/1.55 Nunito,system-ui,sans-serif;color:#2B3540;margin:12px 16px;background:#fff}h2,h3{font-family:Fredoka,Nunito,sans-serif;color:#1E2D3C;font-weight:600}h2{font-size:20px;margin:6px 0 10px}h3{font-size:16px;margin:16px 0 4px}pre,code{font-family:"JetBrains Mono",Menlo,monospace;font-size:12.5px;font-variant-ligatures:none}pre{background:#FBF6EE;border:1px solid #EFE6DA;border-radius:8px;padding:8px 10px;overflow-x:auto}table{border-collapse:collapse}td{vertical-align:top;padding:3px 8px 3px 0;border-bottom:1px solid #EFE6DA}a{color:#2C6CA8}img{max-width:100%}hr{border:0;border-top:1px solid #EFE6DA}table[role=presentation],.container table:first-child{display:none}</style>`,
  aufraeumen(html) { return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<script[^>]*>/gi, '').replace(/<link[^>]*>/gi, '').replace(/<\/head>/i, this.STIL + '</head>'); },
  async thema(alias, pkg) {
    this.schritt({ art: 'thema', args: [alias, pkg] }); this.aktPaket = pkg;
    const box = $('#h-inhalt'); box.innerHTML = '<p class="leer">Lädt …</p>';
    try {
      const html = (await rText(`h <- help("${alias.replace(/"/g, '')}"${pkg ? `, package = "${pkg}"` : ''}); if (!length(h)) "KEINE" else { rd <- utils:::.getHelpFile(h[1]); tf <- tempfile(); tools::Rd2HTML(rd, out = tf, package = basename(dirname(dirname(h[1]))), dynamic = TRUE); paste(readLines(tf, warn = FALSE), collapse = "\\n") }`))[0];
      if (html === 'KEINE') { box.innerHTML = `<p class="leer">Keine Hilfeseite zu <code>${_e(alias)}</code> gefunden.</p>`; return; }
      this.frame(this.aufraeumen(html));
    } catch (e) { box.innerHTML = `<p class="leer">Fehler: ${_e(e.message)}</p>`; }
  },
  async vignette(pkg, item) {
    this.schritt({ art: 'vignette', args: [pkg, item] }); this.aktPaket = pkg;
    const box = $('#h-inhalt'); box.innerHTML = '<p class="leer">Lädt …</p>';
    const html = (await rText(`paste(readLines(system.file("doc", "${item}.html", package = "${pkg}"), warn = FALSE), collapse = "\\n")`))[0];
    this.frame(this.aufraeumen(html));
  },
  suche(q) {
    q = q.trim().toLowerCase(); const box = $('#h-inhalt');
    if (!q) { this.home(); return; }
    const t = this.aliase.filter(a => a.alias.toLowerCase().includes(q));
    t.sort((a, b) => (b.alias.toLowerCase().startsWith(q) - a.alias.toLowerCase().startsWith(q)) || this.KERN.indexOf(a.pkg) - this.KERN.indexOf(b.pkg) || a.alias.length - b.alias.length);
    box.innerHTML = `<h4 class="h-titel">Suche „${_e(q)}“</h4>` + (t.length ? `<ul class="h-index">${t.slice(0, 40).map(a => `<li><button type="button" class="h-link" data-thema="${_e(a.pkg)}:${_e(a.alias)}">${_e(a.alias)}</button> <span class="h-ver">{${_e(a.pkg)}}</span></li>`).join('')}</ul>` : '<p class="leer">Nichts gefunden.</p>');
    return t[0];
  },
  /** Von außen: Hilfe zu einem Namen öffnen (F1, Autovervollständigung, ?name). */
  async zeige(name, pkg) {
    Konsole.offen(); kTab('hilfe'); await this.bereitMachen();
    if (!pkg) { const a = this.aliase.find(x => x.alias === name); pkg = a?.pkg; }
    this.thema(name, pkg);
  },
  async zeigeSuche(q) { Konsole.offen(); kTab('hilfe'); await this.bereitMachen(); $('#h-such').value = q; this.suche(q); },
  async zeigePaket(p) { Konsole.offen(); kTab('hilfe'); await this.bereitMachen(); this.paket(p); },
  async zeigeVignette(name, pkg) {
    Konsole.offen(); kTab('hilfe'); await this.bereitMachen();
    if (!pkg) pkg = (await rText(`vi <- tools::getVignetteInfo(); p <- vi[vi[, "Topic"] == "${name.replace(/"/g, '')}", "Package"]; if (length(p)) p[1] else ""`))[0];
    if (!pkg) { $('#h-inhalt').innerHTML = `<p class="leer">Keine Vignette „${_e(name)}“ gefunden.</p>`; return; }
    this.vignette(pkg, name);
  },
};
document.addEventListener('click', e => {
  const b = e.target.closest('.h-link'); if (!b) return;
  if (b.dataset.paket) Hilfe.paket(b.dataset.paket);
  if (b.dataset.thema) { const [p, a] = b.dataset.thema.split(/:(.*)/); Hilfe.thema(a, p); }
  if (b.dataset.vig) { const [p, v] = b.dataset.vig.split(':'); Hilfe.vignette(p, v); }
});

/* ---------- Autovervollständigung ---------- */
const AC = {
  funktionen: [], variablen: [], objekte: [], args: new Map(), sig: new Map(),
  liste: [], wahl: 0, ta: null, offen: false, still: false,
  async laden() {
    try {
      const f = await rText(`unlist(lapply(c("mariposa", "dplyr", "tidyr", "ggplot2", "haven", "stats", "utils", "base"), function(p) { n <- ls(paste0("package:", p)); n <- n[grepl("^[A-Za-z][A-Za-z0-9._]*$", n)]; n <- n[vapply(n, function(x) is.function(get(x, envir = as.environment(paste0("package:", p)))), TRUE)]; paste(p, n, sep = "\\t") }))`);
      const seen = new Set();
      this.funktionen = f.map(z => z.split('\t')).filter(([, n]) => !seen.has(n) && seen.add(n)).map(([pkg, name]) => ({ name, art: 'Funktion', info: pkg, pkg }));
    } catch { /* ohne */ }
  },
  async variablenLaden() {
    try {
      const v = await rText('paste(names(.za8831), vapply(.za8831, function(x) { l <- attr(x, "label"); if (is.null(l)) "" else as.character(l)[1] }, ""), sep = "\\t")');
      this.variablen = v.map(z => { const [name, info] = z.split('\t'); return { name, art: 'Variable', info }; });
    } catch { /* ohne */ }
  },
  objekteSetzen(zeilen) { this.objekte = zeilen.map(z => { const [name, art, wert] = z.split('\t'); return { name, art: 'Objekt', info: `${art}: ${wert}` }; }); },
  async argumente(fn) {
    if (this.args.has(fn)) return this.args.get(fn);
    let a = [];
    try { a = await rText(`f <- tryCatch(get("${fn}", mode = "function"), error = function(e) NULL); if (is.null(f) || is.null(args(f))) character(0) else setdiff(names(formals(args(f))), "...")`); } catch { /* leer */ }
    this.args.set(fn, a); return a;
  },
  async signatur(fn) {
    if (this.sig.has(fn)) return this.sig.get(fn);
    let s = '';
    try { s = (await rText(`f <- tryCatch(get("${fn}", mode = "function"), error = function(e) NULL); if (is.null(f) || is.null(args(f))) "" else { d <- deparse(args(f)); paste(trimws(d[-length(d)]), collapse = " ") }`))[0].replace(/^function\s*/, fn); } catch { /* leer */ }
    this.sig.set(fn, s); return s;
  },
  /** Wort vor dem Cursor und die Funktion, in deren Klammer der Cursor steht. */
  kontext(ta) {
    const vor = ta.value.slice(0, ta.selectionStart);
    const wort = (vor.match(/[A-Za-z_.][A-Za-z0-9_.]*$/) || [''])[0];
    let tiefe = 0, inStr = false, fn = null;
    for (let i = vor.length - 1 - wort.length; i >= 0; i--) {
      const c = vor[i];
      if (c === '"') inStr = !inStr;
      if (inStr) continue;
      if (c === ')') tiefe++;
      else if (c === '(') { if (tiefe === 0) { fn = (vor.slice(0, i).match(/([A-Za-z_.][A-Za-z0-9_.]*)$/) || [])[1] || null; break; } tiefe--; }
      else if (c === '\n' && tiefe === 0 && !/(%>%|\+|,|\()\s*$/.test(vor.slice(0, i))) break;
    }
    const inString = (vor.match(/"/g) || []).length % 2 === 1;
    return { wort, fn, inString };
  },
  async zeigen(ta, erzwingen) {
    const k = this.kontext(ta); if (k.inString) { this.zu(); return; }
    if (!erzwingen && k.wort.length < 3) { this.zu(); return; }
    if (!k.wort && !k.fn) { this.zu(); return; }
    const w = k.wort.toLowerCase(); const passt = x => x.name.toLowerCase().startsWith(w);
    let args = [];
    if (k.fn) args = (await this.argumente(k.fn)).map(a => ({ name: a, art: 'Argument', info: k.fn + '()' }));
    const kand = [...args.filter(passt), ...this.objekte.filter(passt), ...this.variablen.filter(passt), ...this.funktionen.filter(passt)];
    const rang = { mariposa: 0, dplyr: 1, ggplot2: 1, tidyr: 2, haven: 3, stats: 4, utils: 5, base: 5 };
    const fns = kand.filter(x => x.art === 'Funktion').sort((a, b) => (rang[a.pkg] - rang[b.pkg]) || a.name.length - b.name.length);
    this.liste = [...kand.filter(x => x.art !== 'Funktion'), ...fns].slice(0, 60);
    if (!this.liste.length || (this.liste.length === 1 && this.liste[0].name === k.wort)) { this.zu(); return; }
    this.ta = ta; this.wahl = 0; this.wortLaenge = k.wort.length; this.offen = true;
    this.malen(); this.platz(ta);
  },
  malen() {
    const box = $('#ac'); const it = this.liste[this.wahl];
    box.innerHTML = `<ul role="listbox" id="ac-liste" aria-label="Vorschläge">${this.liste.map((x, i) => `<li role="option" id="ac-${i}" aria-selected="${i === this.wahl}" data-i="${i}"><span class="ac-n">${_e(x.name)}${x.art === 'Funktion' ? '()' : ''}</span><span class="ac-art ${x.art}">${x.art === 'Funktion' ? '{' + _e(x.info) + '}' : x.art}</span>${x.art !== 'Funktion' ? `<span class="ac-info">${_e(x.info)}</span>` : ''}</li>`).join('')}</ul><div class="ac-detail" id="ac-detail"></div>`;
    box.hidden = false;
    this.ta.setAttribute('aria-expanded', 'true'); this.ta.setAttribute('aria-activedescendant', 'ac-' + this.wahl);
    box.querySelector(`#ac-${this.wahl}`)?.scrollIntoView({ block: 'nearest' });
    if (it?.art === 'Funktion') this.signatur(it.name).then(s => { if (this.liste[this.wahl] === it) $('#ac-detail').innerHTML = `<code>${_e(s)}</code><span>Tab/Enter übernehmen, F1 Hilfe</span>`; });
    else $('#ac-detail').innerHTML = `<span>Tab/Enter übernehmen, Esc schließen</span>`;
  },
  platz(ta) {
    const cs = getComputedStyle(ta); const m = document.createElement('div');
    for (const p of ['fontFamily', 'fontSize', 'lineHeight', 'paddingTop', 'paddingLeft', 'whiteSpace', 'letterSpacing', 'tabSize']) m.style[p] = cs[p];
    m.style.position = 'absolute'; m.style.visibility = 'hidden'; m.style.whiteSpace = 'pre'; m.style.fontVariantLigatures = 'none';
    m.textContent = ta.value.slice(0, ta.selectionStart); const sp = document.createElement('span'); sp.textContent = '|'; m.append(sp); document.body.append(m);
    const r = ta.getBoundingClientRect(); let x = r.left + sp.offsetLeft - ta.scrollLeft, y = r.top + sp.offsetTop + sp.offsetHeight - ta.scrollTop;
    m.remove();
    const box = $('#ac'); const h = box.offsetHeight || 220, wdt = box.offsetWidth || 380;
    const unten = window.visualViewport ? visualViewport.offsetTop + visualViewport.height : innerHeight;
    if (y + h > unten - 8) y = y - h - parseFloat(cs.lineHeight) - 4;
    box.style.left = Math.max(8, Math.min(x - 8, innerWidth - wdt - 8)) + 'px'; box.style.top = Math.max(8, y + 2) + 'px';
  },
  zu() { if (!this.offen && $('#ac').hidden) return; this.offen = false; $('#ac').hidden = true; if (this.ta) { this.ta.setAttribute('aria-expanded', 'false'); this.ta.removeAttribute('aria-activedescendant'); } },
  nehmen(i = this.wahl) {
    const x = this.liste[i], ta = this.ta; if (!x || !ta) return;
    const a = ta.selectionStart - this.wortLaenge, b = ta.selectionStart;
    const nachFrage = /\?\s*$/.test(ta.value.slice(0, a));
    const fn = x.art === 'Funktion' && !nachFrage;
    const ins = fn ? x.name + '()' : x.art === 'Argument' ? x.name + ' = ' : x.name;
    const pos = a + ins.length - (fn ? 1 : 0);
    if (typeof Tasten !== 'undefined') Tasten.merken(ta);
    this.still = true; ta.value = ta.value.slice(0, a) + ins + ta.value.slice(b); ta.setSelectionRange(pos, pos);
    ta.dispatchEvent(new Event('input', { bubbles: true })); this.still = false; this.zu(); ta.focus();
    if (fn) this.hinweis(ta, x.name);
  },
  /** Signatur unter dem Cursor einblenden, sobald eine Klammer geöffnet wird. */
  async hinweis(ta, fn) {
    const s = await this.signatur(fn); if (!s) return;
    const box = $('#ac'); this.ta = ta; this.liste = []; this.offen = false;
    box.innerHTML = `<div class="ac-detail ac-sig"><code>${_e(s)}</code><span>F1 Hilfe zu ${_e(fn)}()</span></div>`; box.hidden = false; this.platz(ta);
    clearTimeout(this.sigTimer); this.sigTimer = setTimeout(() => { if (!this.offen) box.hidden = true; }, 6000);
  },
  an(ta) {
    ta.setAttribute('aria-autocomplete', 'list'); ta.setAttribute('aria-controls', 'ac-liste');
    let timer;
    ta.addEventListener('keydown', ev => {
      if (ev.key === 'F1' || (ev.key === 'F1' && ev.metaKey)) {
        ev.preventDefault(); ev.stopImmediatePropagation();
        const v = ta.value, p = ta.selectionStart;
        const w = ((v.slice(0, p).match(/[A-Za-z_.][A-Za-z0-9_.]*$/) || [''])[0] + (v.slice(p).match(/^[A-Za-z0-9_.]*/) || [''])[0]);
        const x = this.offen ? this.liste[this.wahl] : null;
        if (x?.art === 'Funktion') Hilfe.zeige(x.name, x.pkg); else if (w) Hilfe.zeige(w);
        return;
      }
      if (this.offen && this.ta === ta) {
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); ev.stopImmediatePropagation(); this.wahl = (this.wahl + (ev.key === 'ArrowDown' ? 1 : this.liste.length - 1)) % this.liste.length; this.malen(); return; }
        if (ev.key === 'Enter' && this.liste[this.wahl]?.name === this.kontext(ta).wort) { this.zu(); return; }
        if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); ev.stopImmediatePropagation(); this.nehmen(); return; }
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopImmediatePropagation(); this.zu(); return; }
      }
      if (ev.key === 'Tab' && !ev.shiftKey) {
        const k = this.kontext(ta);
        if (k.wort || (k.fn && /[(,]\s*$/.test(ta.value.slice(0, ta.selectionStart)))) { ev.preventDefault(); ev.stopImmediatePropagation(); this.zeigen(ta, true); }
      }
    });
    ta.addEventListener('input', () => {
      if (this.still) return;
      clearTimeout(timer);
      const vor = ta.value.slice(0, ta.selectionStart);
      if (vor.endsWith('(') || vor.endsWith('()') && ta.value[ta.selectionStart] === ')') { const fn = (vor.replace(/\(\)?$/, '').match(/([A-Za-z_.][A-Za-z0-9_.]*)$/) || [])[1]; if (fn) { this.hinweis(ta, fn); return; } }
      if (/[A-Za-z0-9_.]$/.test(vor)) timer = setTimeout(() => this.zeigen(ta, false), 180); else this.zu();
    });
    ta.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== ta) this.zu(); }, 150));
  },
};
document.addEventListener('mousedown', e => { const li = e.target.closest('#ac [data-i]'); if (li) { e.preventDefault(); AC.nehmen(+li.dataset.i); } });

/** Erkennt Hilfe-Befehle wie in RStudio: ?name, ??wort, help(), help(package = ), vignette(), browseVignettes(), help.search().
 *  Gibt die Aktion und den übrigen Code zurück (andere Zeilen laufen normal in R). */
function hilfeBefehl(code) {
  const rest = []; let aktion = null, text = '';
  const Q = '"?\'?', E = '"?\'?';
  for (const z of code.split('\n')) {
    const t = z.trim(); let m;
    if ((m = t.match(/^\?\?\s*["']?([^"']+?)["']?$/))) { const q = m[1]; aktion = () => Hilfe.zeigeSuche(q); text = `Suche nach „${q}“`; }
    else if ((m = t.match(/^\?\s*["']?(?:([\w.]+)::)?([\w.]+)["']?(?:\(\))?$/))) { const [, p, n] = m; aktion = () => Hilfe.zeige(n, p); text = `Hilfe zu ${n}`; }
    else if ((m = t.match(/^(?:help\(\s*package\s*=|browseVignettes\(|vignette\(\s*package\s*=)\s*["']?([\w.]+)["']?\s*\)$/))) { const p = m[1]; aktion = () => Hilfe.zeigePaket(p); text = `Paket ${p}`; }
    else if ((m = t.match(/^help\(\s*["']?(?:([\w.]+)::)?([\w.]+)["']?\s*(?:,\s*package\s*=\s*["']?([\w.]+)["']?\s*)?\)$/))) { const [, p1, n, p2] = m; aktion = () => Hilfe.zeige(n, p2 || p1); text = `Hilfe zu ${n}`; }
    else if ((m = t.match(/^help\.search\(\s*["']([^"']+)["']\s*\)$/))) { const q = m[1]; aktion = () => Hilfe.zeigeSuche(q); text = `Suche nach „${q}“`; }
    else if ((m = t.match(/^vignette\(\s*["']([\w.-]+)["']\s*(?:,\s*package\s*=\s*["']?([\w.]+)["']?\s*)?\)$/))) { const [, n, p] = m; aktion = () => Hilfe.zeigeVignette(n, p); text = `Vignette ${n}`; }
    else if ((m = t.match(/^View\(\s*([\w.]+)\s*\)$/))) { const n = m[1]; aktion = () => Umgebung.view(n); text = `Datenansicht von ${n}`; }
    else rest.push(z);
  }
  return aktion ? { aktion, text, rest: rest.join('\n').trim() } : null;
}
