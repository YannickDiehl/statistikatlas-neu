/* Environment, History und View() wie in RStudio. Prototyp. */
'use strict';
const ICON = {
  besen: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 1.5l1.6 1-3.3 5.2" fill="none" stroke="#8a6a2c" stroke-width="1.6" stroke-linecap="round"/><path d="M4.2 8.2l5.3 3.3-1.6 3.1c-2-.4-4.6-2-5.6-3.4z" fill="#E7B65A" stroke="#8a6a2c"/><path d="M5 7.5l4.6 2.9.8-1.3-4.6-2.9z" fill="#C9921C"/></svg>',
  neu: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6" fill="none" stroke="#2C6CA8" stroke-width="1.7"/><path d="M12.6 1.8v3.3H9.3" fill="none" stroke="#2C6CA8" stroke-width="1.7"/></svg>',
  tabelle: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="#fff" stroke="#2C6CA8" stroke-width="1.3"/><path d="M1.5 6.5h13M1.5 10h13M6 6.5v7M10.5 6.5v7" stroke="#2C6CA8" stroke-width="1.1"/><rect x="1.5" y="2.5" width="13" height="4" rx="2" fill="#86B9DE" stroke="#2C6CA8" stroke-width="1.3"/></svg>',
  auf: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#86B9DE"/><path d="M6.5 5l3.5 3-3.5 3" fill="none" stroke="#1E2D3C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const _u = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const Umgebung = {
  objekte: [], offen: new Set(), ansicht: 'list', suche: '', befehle: [], rDa: false, vorher: new Set(),
  async rFunktionen() {
    if (this.rDa) return; this.rDa = true;
    await R.w.evalRVoid(`
.env_liste <- function() {
  nm <- ls(globalenv()); if (!length(nm)) return(character(0))
  vapply(nm, function(n) {
    x <- get(n, envir = globalenv())
    teil <- if (is.data.frame(x) || is.matrix(x)) "Data" else if (is.function(x)) "Functions" else "Values"
    wert <- if (is.data.frame(x)) paste(nrow(x), "obs. of", ncol(x), "variables")
      else if (is.function(x)) paste(trimws(deparse(args(x))[1]))
      else if (inherits(x, "ggplot") || inherits(x, "ggplot2::ggplot")) "<ggplot> Grafik"
      else { z <- capture.output(str(x, give.attr = FALSE, vec.len = 3, max.level = 0)); trimws(z[1]) }
    groesse <- tryCatch(format(object.size(x), units = "auto", standard = "SI"), error = function(e) "")
    paste(n, teil, wert, class(x)[1], length(x), groesse, sep = "\\t")
  }, "", USE.NAMES = FALSE)
}
.env_df <- function(n) {
  x <- get(n, envir = globalenv())
  z <- capture.output(str(as.list(x), give.attr = FALSE, list.len = 100000, vec.len = 2, give.head = TRUE))[-1]
  z <- z[!grepl("^\\\\s+\\\\.\\\\.@ labels", z)]
  z
}
.env_view <- function(n, r1, r2, c1, c2) {
  x <- get(n, envir = globalenv()); if (!is.data.frame(x)) x <- as.data.frame(x)
  nr <- nrow(x); nc <- ncol(x); c2 <- min(c2, nc); r2 <- min(r2, nr); cols <- seq.int(c1, c2)
  lab <- vapply(cols, function(j) { l <- attr(x[[j]], "label"); if (is.null(l)) "" else as.character(l)[1] }, "")
  body <- if (r2 >= r1) vapply(cols, function(j) { v <- x[[j]][r1:r2]; v <- if (is.factor(v)) as.character(v) else as.vector(unclass(v)); o <- format(v, trim = TRUE); o[is.na(v)] <- "NA"; paste(o, collapse = "\\x1f") }, "") else character(0)
  c(paste(nr, nc, sep = "\\t"), paste(names(x)[cols], collapse = "\\t"), paste(lab, collapse = "\\t"), body)
}`);
  },
  async laden(markieren) {
    if (!R.w) return;
    try {
      await this.rFunktionen();
      const z = await rText('.env_liste()');
      this.objekte = z.map(s => { const [name, teil, wert, klasse, laenge, groesse] = s.split('\t'); return { name, teil, wert, klasse, laenge, groesse }; });
      const neu = new Set(this.objekte.map(o => o.name + o.wert));
      this.neu = markieren ? new Set([...neu].filter(x => !this.vorher.has(x))) : new Set(); this.vorher = neu;
      if (this.strCache) for (const o of this.objekte) if (this.neu.has(o.name + o.wert)) delete this.strCache[o.name];
      AC.objekte = this.objekte.map(o => ({ name: o.name, art: 'Objekt', info: o.wert }));
      const zahl = document.getElementById('env-zahl'); if (zahl) { const n = this.objekte.length; zahl.textContent = n ? `${n} ${n === 1 ? 'Objekt' : 'Objekte'}` : ''; }
      for (const n of this.offen) if (!this.objekte.some(o => o.name === n && o.teil === 'Data')) this.offen.delete(n);
      await this.malen();
    } catch { /* Prototyp */ }
  },
  async malen() {
    const box = $('#env-body'); const q = this.suche.toLowerCase();
    const obj = this.objekte.filter(o => !q || o.name.toLowerCase().includes(q));
    if (!obj.length) { box.innerHTML = `<p class="rs-leer">${this.objekte.length ? 'Kein Objekt passt zur Suche.' : 'Environment is empty'}</p>`; return; }
    if (this.ansicht === 'grid') {
      box.innerHTML = `<table class="rs-grid"><thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Length</th><th scope="col">Size</th><th scope="col">Value</th></tr></thead><tbody>${obj.map(o => `<tr class="${this.neu?.has(o.name + o.wert) ? 'neu' : ''}"><td>${_u(o.name)}</td><td>${_u(o.klasse)}</td><td>${_u(o.laenge)}</td><td>${_u(o.groesse)}</td><td>${_u(o.wert)}</td></tr>`).join('')}</tbody></table>`;
      return;
    }
    let h = '';
    for (const teil of ['Data', 'Values', 'Functions']) {
      const t = obj.filter(o => o.teil === teil); if (!t.length) continue;
      h += `<div class="rs-teil" data-teil="${teil}">${teil}</div>`;
      for (const o of t) {
        const nm = _u(o.name), neu = this.neu?.has(o.name + o.wert) ? ' neu' : '';
        if (teil === 'Data') {
          const auf = this.offen.has(o.name);
          h += `<div class="rs-zeile data${neu}"><button type="button" class="rs-auf${auf ? ' offen' : ''}" data-env-auf="${nm}" aria-expanded="${auf}" aria-label="${nm} aufklappen">${ICON.auf}</button><span class="rs-name">${nm}</span><span class="rs-wert">${_u(o.wert)}</span><button type="button" class="rs-view" data-env-view="${nm}" title="View(${nm})" aria-label="${nm} als Tabelle ansehen">${ICON.tabelle}</button></div>`;
          if (auf) h += `<div class="rs-str" id="str-${nm}">${this.strCache?.[o.name] || '<span class="rs-leer">lädt …</span>'}</div>`;
        } else h += `<div class="rs-zeile${neu}"><span class="rs-name">${nm}</span><span class="rs-wert">${_u(o.wert)}</span></div>`;
      }
    }
    box.innerHTML = h;
    for (const n of this.offen) if (!this.strCache?.[n]) this.str(n);
  },
  async str(n) {
    const z = await rText(`.env_df("${n}")`);
    let h = '';
    for (const zeile of z) {
      const m = zeile.match(/^ \$ ([^:]+?)\s*:\s*(.*)$/);
      if (m) h += `<div class="rs-spalte"><span class="rs-sp">$ ${_u(m[1])}</span><span class="rs-typ">: ${_u(m[2])}</span></div>`;
      else { const l = zeile.match(/\.\.@ label\s*:\s*chr\s*"(.*)"$/); if (l) h += `<div class="rs-label">${_u(l[1])}</div>`; }
    }
    this.strCache = this.strCache || {}; this.strCache[n] = h;
    const el = document.getElementById('str-' + n); if (el) el.innerHTML = h;
  },
  async leeren() {
    if (!R.bereit) return;
    if (!confirm('Alle Objekte aus dem Environment entfernen?\n\nDas lässt sich nicht rückgängig machen. Danach fehlt auch allbus: Führe dann den Startblock oben im Journal aus.')) return;
    await R.w.evalRVoid('rm(list = ls(globalenv()), envir = globalenv())');
    this.strCache = {}; Konsole.info('Environment geleert. <code>allbus</code> holst du mit dem Startblock oben im Journal zurück.'); this.laden();
  },
  /* History wie in RStudio */
  merken(code) { if (!code.trim()) return; this.befehle.push(code.trim()); if (!$('#envp-hist').hidden) this.history(); },
  history() {
    const box = $('#hist-body');
    box.innerHTML = this.befehle.length ? this.befehle.map((c, i) => `<button type="button" class="rs-hist" data-hist="${i}" title="In die Konsole übernehmen">${_u(c)}</button>`).join('') : '<p class="rs-leer">Noch keine Befehle.</p>';
    box.scrollTop = box.scrollHeight;
  },
  tab(n) {
    ['env', 'hist'].forEach(x => { const an = x === n; $('#envt-' + x).setAttribute('aria-selected', an); $('#envt-' + x).tabIndex = an ? 0 : -1; $('#envp-' + x).hidden = !an; });
    if (n === 'hist') this.history();
  },
  /* View() als Datenansicht */
  v: null,
  async view(n) {
    if (!R.bereit) return;
    await this.rFunktionen();
    this.v = { n, r1: 1, c1: 1, schritt: 100, breite: 50 };
    $('#viewer').hidden = false; $('#viewer-titel').textContent = n; await this.viewLaden(); $('#viewer .zu').focus();
  },
  async viewLaden() {
    const v = this.v; const z = await rText(`.env_view("${v.n}", ${v.r1}, ${v.r1 + v.schritt - 1}, ${v.c1}, ${v.c1 + v.breite - 1})`);
    const [nr, nc] = z[0].split('\t').map(Number); v.nr = nr; v.nc = nc;
    const namen = z[1].split('\t'), labels = z[2].split('\t'), spalten = z.slice(3).map(s => s.split('\x1f'));
    const zeilen = spalten[0]?.length || 0;
    let h = `<table class="rs-view-tab"><thead><tr><th scope="col" class="rn"></th>${namen.map((n, j) => `<th scope="col"><span>${_u(n)}</span>${labels[j] ? `<small>${_u(labels[j])}</small>` : ''}</th>`).join('')}</tr></thead><tbody>`;
    for (let i = 0; i < zeilen; i++) h += `<tr><th scope="row" class="rn">${v.r1 + i}</th>${spalten.map(s => `<td class="${s[i] === 'NA' ? 'na' : ''}">${_u(s[i])}</td>`).join('')}</tr>`;
    $('#viewer-tab').innerHTML = h + '</tbody></table>';
    const bis = Math.min(v.r1 + v.schritt - 1, nr), cbis = Math.min(v.c1 + v.breite - 1, nc);
    $('#viewer-info').textContent = `Showing ${v.r1} to ${bis} of ${nr.toLocaleString('en-US')} entries, ${nc} total columns`;
    $('#viewer-cols').textContent = `Cols: ${v.c1}–${cbis}`;
    $('#viewer-rzurueck').disabled = v.r1 <= 1; $('#viewer-rvor').disabled = bis >= nr;
    $('#viewer-czurueck').disabled = v.c1 <= 1; $('#viewer-cvor').disabled = cbis >= nc;
  },
};
document.addEventListener('click', e => {
  const a = e.target.closest('[data-env-auf]');
  if (a) { const n = a.dataset.envAuf; Umgebung.offen.has(n) ? Umgebung.offen.delete(n) : Umgebung.offen.add(n); Umgebung.malen(); return; }
  const v = e.target.closest('[data-env-view]'); if (v) { Umgebung.view(v.dataset.envView); return; }
  const h = e.target.closest('[data-hist]'); if (h) { Konsole.einfuegen(Umgebung.befehle[+h.dataset.hist]); }
});
