/* Lernpfad-Engine: ein Kapitel mit Aufgaben, Verstehen, Mitnehmen, Lernjournal und Konsole (webR).
   Kapitelinhalte kommen aus daten.js (content.ts des Atlas), kapitel.js (Aufgaben) und dem React-Bündel (Verstehen, Mitnehmen). */
'use strict';
const D = window.KDATEN;
const T = D.TEMPLATES;
const $ = (s, el = document) => el.querySelector(s);
/* Marken ⟪…⟫ nie in Journal-Daten oder Export übernehmen (Texte aus Aufgaben, Schritten, Kapitel-Meta). */
const ohne = s => (window.Begriffe?.ohne ?? (x => x))(String(s ?? ''));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const codeHtml = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

/* ---------- Kapitel: Meta (aus der Seite), Daten (daten.js) und Aufgaben (kapitel.js) ---------- */
const META = window.KMETA;
const NR = META.nr, PFX = 'k' + String(NR).padStart(2, '0');
const bild = (key, label) => ({ art: 'bild', label, titel: label.replace(/^Bild: /, ''), key });
const warum = (label, html, grund) => ({ art: 'warum', label, titel: label, html, grund });
/** Ausgebautes „?“-Fenster: Kurz gesagt, Denkweg (Fragen ohne Antworten), Bild aus „Verstehen“, Verwechslung. */
const denk = (label, o) => ({ art: 'warum', label, titel: label, grund: o.grund, denk: o });
const probier = (label, html, code, aufgabe) => ({ art: 'code', label, titel: label, html, code, aufgabe, idee: label });
const KAP = window.KAPITEL({ D, T, esc, codeHtml, bild, warum, probier, denk });
const BILD = KAP.BILD || {};
const TASKS = KAP.TASKS;
const FREI = KAP.FREI || {};
const ALLE_SCHRITTE = TASKS.flatMap(t => t.schritte.map(s => ({ ...s, aufgabe: t })));

try { localStorage.setItem('lernpfad-letzte', META.kapitel); } catch { /* egal */ }
/* ---------- Kapitel-Menü: wenn die linke Leiste fehlt (schmale Bildschirme, Journal offen), öffnet „☰ Kapitel“ sie als Schublade ---------- */
const KapMenue = {
  offen(an) {
    const nav = document.getElementById('sitzungen'), knopf = document.getElementById('kap-menue');
    an = an ?? !nav.classList.contains('schublade');
    nav.classList.toggle('schublade', an); document.getElementById('kap-schleier').hidden = !an; knopf.setAttribute('aria-expanded', an);
    if (an) (nav.querySelector('li.jetzt') || nav).scrollIntoView({ block: 'center' }), nav.querySelector('a')?.focus({ preventScroll: true }); else knopf.focus({ preventScroll: true });
  },
};
document.getElementById('kap-menue').onclick = () => KapMenue.offen();
document.getElementById('kap-schleier').onclick = () => KapMenue.offen(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('sitzungen').classList.contains('schublade')) { e.stopImmediatePropagation(); KapMenue.offen(false); } }, true);


/* ---------- Gespeicherter Stand (nur Bequemlichkeit) ---------- */
const KEY = PFX + '-fokus-v1';
let S = { fertig: {}, wahl: {}, antwort: {} };
try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { /* ohne Speicher */ }
const sichern = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* egal */ } };

/* ---------- Werkstatt: Marken ---------- */
function marken(vorlage) {
  const ranges = []; let code = '', last = 0;
  for (const m of vorlage.matchAll(/⟦(.*?)⟧/g)) {
    code += vorlage.slice(last, m.index);
    ranges.push({ from: code.length, to: code.length + m[1].length, wort: m[1] });
    code += m[1]; last = m.index + m[0].length;
  }
  return { code: code + vorlage.slice(last), ranges };
}
function malen(code, ranges) {
  return RFarbe.html(code, ranges) + '\n';
}

/* ---------- Code-Block auf der Seite: dokumentiert, nicht editierbar ---------- */
const zielVon = code => (code.match(/^#\s*(.+)$/m) || [, ''])[1];
const brauchstVon = code => [...new Set([...code.matchAll(/([A-Za-z_][\w.]*)\(/g)].map(m => m[1] + '()'))];
function codeBlock(key, schritt, aufgabe) {
  const v = T[key]; const p = marken(v.code);
  const el = document.createElement('div'); el.className = 'cb'; el.dataset.key = key;
  if (S.vorlage === 'selbst') {
    el.classList.add('selbst');
    el.innerHTML = `<div class="cb-kopf"><span class="cb-titel">${esc(v.title)}</span>
      <button type="button" class="ins-journal" data-key="${key}">→ Journal</button><button type="button" data-a="zeigen" aria-expanded="false">Vorlage zeigen</button></div>
      <p class="cb-ziel"><b>Ziel:</b> ${esc(zielVon(p.code))}.<span class="brauchst">Du brauchst: ${brauchstVon(p.code).map(f => `<code>${esc(f)}</code>`).join(' ')}</span></p>
      <pre hidden aria-label="${esc(v.title)}">${malen(p.code, p.ranges).replace(/\n$/, '')}</pre>`;
    $('.ins-journal', el).onclick = () => Journal.holen(key, schritt, aufgabe);
    $('[data-a=zeigen]', el).onclick = ev => { const pre = $('pre', el); pre.hidden = !pre.hidden; ev.target.textContent = pre.hidden ? 'Vorlage zeigen' : 'Vorlage verbergen'; ev.target.setAttribute('aria-expanded', !pre.hidden); };
    return el;
  }
  el.innerHTML = `<div class="cb-kopf"><span class="cb-titel">${esc(v.title)}</span>
    <button type="button" class="ins-journal" data-key="${key}">→ Journal</button><button type="button" data-a="kopie">Kopieren</button></div>
    <pre aria-label="${esc(v.title)}">${malen(p.code, p.ranges).replace(/\n$/, '')}</pre>
    ${p.ranges.length ? `<p class="cb-stellen">Im Journal anpassen: ${p.ranges.map(r => `<mark>${esc(r.wort)}</mark>`).join(' ')}</p>` : ''}`;
  $('.ins-journal', el).onclick = () => Journal.holen(key, schritt, aufgabe);
  $('[data-a=kopie]', el).onclick = async ev => { try { await navigator.clipboard.writeText(p.code); ev.target.textContent = 'Kopiert ✓'; setTimeout(() => ev.target.textContent = 'Kopieren', 1500); } catch { /* egal */ } };
  return el;
}

/* ---------- Editor im Journal (mit gelben Stellen) ---------- */
function editor(block, beiAenderung, beiLauf) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="wk-editor"><div class="wk-nr" aria-hidden="true"></div><div class="wk-feld"><pre class="wk-back" aria-hidden="true"></pre>
    <textarea autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" aria-label="Code: ${esc(ohne(block.titel))}" placeholder="${block.frei ? 'Dein Code, zum Beispiel allbus %>% …' : block.hinweis ? 'Schreib hier deinen Code. Die Vorlage siehst du links unter „Vorlage zeigen“.' : ''}"></textarea></div></div><p class="wk-stellen" ${block.ranges.length ? '' : 'hidden'}></p>`;
  const ta = $('textarea', wrap), back = $('.wk-back', wrap), nr = $('.wk-nr', wrap), st = $('.wk-stellen', wrap);
  let alt = block.code;
  const zeichnen = () => {
    back.innerHTML = malen(ta.value, block.ranges);
    const n = ta.value.split('\n').length;
    nr.innerHTML = Array.from({ length: n }, (_, i) => `<span>${i + 1}</span>`).join(''); ta.rows = n;
    if (!st.hidden) st.innerHTML = block.ranges.length ? 'Anpassen: ' + block.ranges.map(r => `<mark>${esc(r.wort)}</mark>`).join(' ') : '✓ Alle gelben Stellen angepasst.';
  };
  ta.value = block.code; zeichnen();
  // Rückgängig stellt auch die gelben Stellen wieder her.
  ta.verlaufExtra = { holen: () => block.ranges.map(r => ({ ...r })), setzen: v => { block.ranges = v; zeichnen(); beiAenderung(); } };
  ta.addEventListener('input', () => {
    const neu = ta.value; let a = 0;
    while (a < alt.length && a < neu.length && alt[a] === neu[a]) a++;
    let e1 = alt.length, e2 = neu.length;
    while (e1 > a && e2 > a && alt[e1 - 1] === neu[e2 - 1]) { e1--; e2--; }
    const d = e2 - e1;
    block.ranges = block.ranges.filter(r => !(a < r.to && e1 > r.from) && !(a === e1 && a > r.from && a < r.to)).map(r => r.from >= e1 ? { ...r, from: r.from + d, to: r.to + d } : r);
    alt = neu; block.code = neu; zeichnen(); beiAenderung();
  });
  ta.addEventListener('scroll', () => { back.scrollLeft = ta.scrollLeft; back.scrollTop = ta.scrollTop; });
  Tasten.an(ta, beiLauf);
  return wrap;
}
async function bildUrl(bmp) {
  const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; c.getContext('2d').drawImage(bmp, 0, 0);
  return c.toDataURL('image/png');
}

/* ---------- Lernjournal ---------- */
/** Zeilen, die nur in der Konsole Sinn ergeben (Hilfe, View), werden für das Rendern auskommentiert. */
const nurInteraktiv = code => code.split('\n').map(z => /^\s*(\?|View\(|help(\.search)?\(|vignette\(|browseVignettes\()/.test(z) ? `# ${z}  # nur in der Konsole sinnvoll` : z).join('\n');
/** iPad-Tastatur: typografische Anführungszeichen und Minus außerhalb von Zeichenketten in R-Zeichen umwandeln.
    Innerhalb von "…" bleibt alles, wie es ist (dort darf „so“ stehen). */
function geradeZeichen(code) {
  let aus = '', inStr = null, krumm = false;
  for (const ch of code) {
    if (inStr) {
      // Ein mit „“ geöffneter String endet auch an einem typografischen Zeichen; das wird dabei gerade.
      if (ch === inStr || (krumm && (inStr === '"' ? '“”' : '‘’').includes(ch))) { aus += inStr; inStr = null; continue; }
      aus += ch; continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; krumm = false; aus += ch; continue; }
    if ('“”„'.includes(ch)) { inStr = '"'; krumm = true; aus += '"'; continue; }
    if ('‘’‚'.includes(ch)) { inStr = "'"; krumm = true; aus += "'"; continue; }
    aus += ch === '−' ? '-' : ch;
  }
  return aus;
}
const kommentarKopf = b => (b.frei ? `# ${ohne(b.titel)}\n` : '') + (b.hinweis ? `# ${ohne(b.hinweis)}\n` : '');
const JKEY = PFX + '-journal-v1';
const Journal = {
  bloecke: [], modus: 'bearbeiten', aus: new Map(), zahl: 0,
  laden() { try { const j = JSON.parse(localStorage.getItem(JKEY) || 'null'); if (j) { this.bloecke = (j.bloecke || []).map(b => { for (const f of ['text', 'titel', 'hinweis']) if (typeof b[f] === 'string') b[f] = ohne(b[f]); return b; }); this.zahl = j.zahl || 0; } } catch { /* leer */ } },
  sichern() {
    try { localStorage.setItem(JKEY, JSON.stringify({ bloecke: this.bloecke, zahl: this.zahl })); $('#j-status').textContent = 'Im Browser gespeichert, ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr. Am Ende herunterladen.'; } catch { $('#j-status').textContent = 'Kann nicht im Browser speichern – bitte herunterladen.'; }
    const n = this.bloecke.filter(b => b.typ !== 'aufgabe').length;
    $('#ap-zahl').textContent = n ? n : '';
    document.querySelectorAll('.ins-journal').forEach(b => { const drin = this.bloecke.some(x => x.key === b.dataset.key); b.classList.toggle('drin', drin); b.textContent = drin ? 'Im Journal ✓' : '→ Journal'; });
  },
  id() { return 'j' + (++this.zahl); },
  einordnen(aufgabe, neu) {
    const B = this.bloecke, nr = a => +a.slice(1);
    if (!B.some(b => b.typ === 'aufgabe' && b.aufgabe === aufgabe)) {
      let pos = B.findIndex(b => b.typ === 'aufgabe' && nr(b.aufgabe) > nr(aufgabe)); if (pos < 0) pos = B.length;
      B.splice(pos, 0, { typ: 'aufgabe', id: this.id(), aufgabe });
    }
    let last = -1; B.forEach((b, i) => { if (b.aufgabe === aufgabe) last = i; });
    B.splice(last + 1, 0, ...neu.map(b => ({ ...b, id: this.id(), aufgabe })));
    this.sichern(); this.zeichnen();
    return B[last + 1].id;
  },
  holen(key, schritt, aufgabe) {
    Arbeitsplatz.offen(true);
    if (Auftrag?.aktiv()) { jetzt = schritt.id; Auftrag.zeigen(schritt.id); }
    const da = this.bloecke.find(b => b.key === key);
    if (da) { this.zeigen(da.id); return; }
    let p = marken(T[key].code);
    let hinweis = null;
    if (S.vorlage === 'selbst') { hinweis = `Ziel: ${zielVon(p.code)}. Du brauchst: ${brauchstVon(p.code).join(', ')}`; p = { code: '', ranges: [] }; }
    const nr = aufgabe.schritte.indexOf(schritt) + 1;
    const id = this.einordnen(aufgabe.id, [{ typ: 'code', key, schritt: schritt.id, titel: ohne(`Schritt ${nr}: ${schritt.titel}`), hinweis: hinweis && ohne(hinweis), code: p.code, ranges: p.ranges }]);
    this.zeigen(id);
  },
  probierHolen(code, aufgabeId, titel) {
    Arbeitsplatz.offen(true);
    const id = this.einordnen(aufgabeId, [{ typ: 'code', key: null, schritt: null, frei: true, titel: ohne(titel), code: code.replace(/\n+$/, ''), ranges: [] }]);
    this.zeigen(id, true); fortschritt();
  },
  notiz(aufgabeId, text = '', art = 'notiz') {
    Arbeitsplatz.offen(true);
    const id = this.einordnen(aufgabeId, [{ typ: art, text }]);
    this.zeigen(id, true);
  },
  zeigen(id, fokus) {
    if (this.modus !== 'bearbeiten') this.umschalten('bearbeiten');
    const el = document.getElementById(id); if (!el) return;
    el.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); el.classList.remove('blitz'); void el.offsetWidth; el.classList.add('blitz');
    const f = $(fokus ? 'textarea' : 'mark', el) ? $('textarea', el) : null; if (f) { f.focus({ preventScroll: true }); if (fokus) f.setSelectionRange(f.value.length, f.value.length); }
  },
  weg(id) { this._weg(id); fortschritt(); },
  _weg(id) { this.bloecke = this.bloecke.filter(b => b.id !== id); this.bloecke = this.bloecke.filter(b => b.typ !== 'aufgabe' || this.bloecke.some(x => x.typ !== 'aufgabe' && x.aufgabe === b.aufgabe)); this.sichern(); this.zeichnen(); },
  async lauf(b, el) {
    const aus = $('.wk-aus', el); aus.hidden = false;
    const status = $('.wk-status', aus); status.hidden = false;
    $('.ausgabe-text', aus).hidden = true; $('.meldungen', aus).innerHTML = ''; $('.bilder', aus).innerHTML = '';
    if (!R.datei) { status.innerHTML = 'Erst die ALLBUS-Datei wählen. <button type="button" class="klein-knopf" data-datei>Datei wählen</button>'; return; }
    status.textContent = R.bereit ? 'R rechnet …' : 'R startet (beim ersten Mal etwa 20 Sekunden) …';
    let code = b.code; Umgebung.merken(code); const hb = hilfeBefehl(code);
    if (hb) { hb.aktion(); if (!hb.rest) { status.textContent = `${hb.text} steht unten im Reiter Help.`; return; } code = hb.rest; }
    const o = await R.lauf(code, true);
    const bilder = []; for (const bmp of o.images) bilder.push(await bildUrl(bmp));
    this.aus.set(b.id, { text: o.text, messages: o.messages, bilder });
    this.ausgabe(b, el);
    if (b.schritt && !o.messages.some(m => m.kind === 'error')) fertig(b.schritt);
    Konsole.umgebung(true);
  },
  ausgabe(b, el) {
    const o = this.aus.get(b.id); const aus = $('.wk-aus', el); if (!o) return;
    aus.hidden = false; const status = $('.wk-status', aus); status.hidden = true;
    const txt = $('.ausgabe-text', aus); txt.hidden = !o.text; txt.textContent = o.text;
    $('.meldungen', aus).innerHTML = o.messages.map(m => `<li class="${m.kind}">${m.kind === 'error' ? 'Fehler: ' : m.kind === 'warning' ? 'Warnung: ' : ''}${esc(m.text)}</li>`).join('');
    $('.bilder', aus).innerHTML = o.bilder.map(u => `<img src="${u}" alt="Grafik aus R" style="max-width:100%;display:block;margin:4px 0 8px">`).join('');
    if (!o.text && !o.messages.length && !o.bilder.length) { status.hidden = false; status.textContent = 'Fertig, ohne Ausgabe.'; }
  },
  zeichnen() {
    const box = $('#j-inhalt');
    if (this.modus === 'vorschau') { box.innerHTML = `<div class="vorschau">${this.vorschauHtml()}</div>`; return; }
    box.innerHTML = '';
    const start = document.createElement('div'); start.className = 'jc start';
    start.innerHTML = `<div class="jc-kopf"><span class="lbl">Startblock</span><span style="font-size:12.5px;color:var(--mute)">lädt die Pakete und liest den ALLBUS ein</span><button type="button" class="run">▶ Ausführen</button></div><pre class="start-code">${esc(T.start.code)}</pre><div class="wk-aus" hidden><div class="wk-status"></div></div>`;
    $('.run', start).onclick = async () => {
      const aus = $('.wk-aus', start), st = $('.wk-status', start); aus.hidden = false;
      if (!R.datei) { st.innerHTML = 'Erst die ALLBUS-Datei wählen. <button type="button" class="klein-knopf" data-datei>Datei wählen</button>'; return; }
      st.textContent = 'Liest den ALLBUS ein …'; Umgebung.merken(T.start.code);
      const o = await R.lauf(T.start.code, true);
      st.textContent = o.messages.some(m => m.kind === 'error') ? 'Fehler: ' + o.messages.map(m => m.text).join(' ') : 'Fertig: allbus steht im Environment.';
      Konsole.umgebung(true);
    };
    box.append(start);
    const B = this.bloecke;
    if (!B.length) {
      box.insertAdjacentHTML('beforeend', '<p class="j-leer">Noch leer. Hol dir Code aus den Aufgaben mit <b>→ Journal</b>, oder leg hier selbst einen Block an. Ergebnisse aus „Ergebnis festhalten“ landen auch hier.</p>');
      box.append(this.endKnoepfe(() => 0, null)); return;
    }
    // Blöcke ohne Aufgabe stehen oben, direkt unter dem Startblock.
    let ziel = document.createElement('div'); ziel.className = 'j-bloecke j-oben'; box.append(ziel);
    ziel.append(this.zwischen(0, null));
    B.forEach((b, i) => {
      if (b.typ === 'aufgabe') {
        const t = TASKS.find(x => x.id === b.aufgabe);
        const sek = document.createElement('section'); sek.className = 'j-abschnitt'; sek.id = b.id;
        sek.innerHTML = `<div class="j-h"><span class="st c7" aria-hidden="true">A${t.n}</span><h3>Aufgabe ${t.n}: ${esc(ohne(t.titel))}</h3></div><p class="j-frage">${esc(ohne(t.frage))}</p><div class="j-bloecke"></div>`;
        sek.append(this.endKnoepfe(() => this.bloecke.map(x => x.aufgabe).lastIndexOf(t.id) + 1, t.id));
        box.append(sek); ziel = $('.j-bloecke', sek);
        ziel.append(this.zwischen(i + 1, b.aufgabe));
        return;
      }
      if (b.typ === 'code') {
        const el = document.createElement('div'); el.className = 'jc' + (b.frei ? ' frei-block' : ''); el.id = b.id;
        el.innerHTML = `<div class="jc-kopf"><span class="lbl" title="${esc(ohne(b.titel))}">${esc(ohne(b.titel))}</span><button type="button" class="run">▶ Ausführen</button><button type="button" class="weg" aria-label="Block entfernen">✕</button></div>`;
        if (b.hinweis) el.insertAdjacentHTML('beforeend', `<p class="jc-hinweis">${esc(b.hinweis)}</p>`);
        el.append(editor(b, () => this.sichern(), () => this.lauf(b, el)));
        el.insertAdjacentHTML('beforeend', '<div class="wk-aus" hidden><p class="label">Ausgabe</p><div class="wk-status"></div><pre class="ausgabe-text" hidden></pre><ul class="meldungen"></ul><div class="bilder"></div></div>');
        $('.run', el).onclick = () => this.lauf(b, el);
        $('.weg', el).onclick = () => this.weg(b.id);
        ziel.append(el); this.ausgabe(b, el);
      } else {
        const el = document.createElement('div'); el.className = 'jn' + (b.typ === 'ergebnis' ? ' ergebnis' : ''); el.id = b.id;
        el.innerHTML = `<textarea rows="2" aria-label="${b.typ === 'ergebnis' ? 'Ergebnis' : 'Deine Notiz'}" placeholder="Deine Notiz: Was fällt dir auf? Was bedeutet das Ergebnis?"></textarea><button type="button" class="weg" aria-label="Notiz entfernen">✕</button>`;
        const ta = $('textarea', el); ta.value = b.text;
        const hoch = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; };
        ta.oninput = () => { b.text = ta.value; hoch(); this.sichern(); };
        $('.weg', el).onclick = () => this.weg(b.id);
        ziel.append(el); requestAnimationFrame(hoch);
      }
      // Einfügestelle nach jedem Block; am Ende eines Abschnitts stehen stattdessen die sichtbaren Knöpfe.
      const n = B[i + 1];
      if (n && !(b.aufgabe && n.typ === 'aufgabe')) ziel.append(this.zwischen(i + 1, b.aufgabe));
    });
    if (!B.some(b => b.typ === 'aufgabe')) box.append(this.endKnoepfe(() => this.bloecke.length, null));
  },
  /** Neuer leerer Block an Stelle pos (Index in bloecke), zugehörig zu einer Aufgabe oder frei (null). */
  einfuegen(pos, aufgabe, typ) {
    Arbeitsplatz.offen(true);
    const b = typ === 'code' ? { typ: 'code', key: null, schritt: null, frei: true, titel: 'Eigener Code', code: '', ranges: [] } : { typ: 'notiz', text: '' };
    b.id = this.id(); b.aufgabe = aufgabe;
    this.bloecke.splice(Math.max(0, Math.min(pos, this.bloecke.length)), 0, b);
    this.sichern(); this.zeichnen(); this.zeigen(b.id, true); fortschritt();
  },
  /** Schmale Einfügestelle zwischen zwei Blöcken: „+“, bei Zeigen oder Tippen „+ Code“ und „+ Notiz“. */
  zwischen(pos, aufgabe) {
    const d = document.createElement('div'); d.className = 'j-zw';
    d.innerHTML = '<button type="button" class="j-zw-plus" aria-expanded="false" title="Hier einen Block einfügen"><span aria-hidden="true">+</span><span class="sr-only">Hier einen Block einfügen</span></button><span class="j-zw-wahl"><button type="button" data-t="code">+ Code</button><button type="button" data-t="notiz">+ Notiz</button></span>';
    const plus = $('.j-zw-plus', d);
    plus.onclick = () => { const auf = !d.classList.contains('offen'); d.classList.toggle('offen', auf); plus.setAttribute('aria-expanded', auf); if (auf) $('[data-t=code]', d).focus(); };
    d.addEventListener('focusout', e => { if (!d.contains(e.relatedTarget)) { d.classList.remove('offen'); plus.setAttribute('aria-expanded', 'false'); } });
    d.querySelectorAll('[data-t]').forEach(k => k.onclick = () => this.einfuegen(pos, aufgabe, k.dataset.t));
    return d;
  },
  /** Sichtbare Knöpfe am Ende eines Abschnitts (oder des leeren Journals). */
  endKnoepfe(pos, aufgabe) {
    const d = document.createElement('div'); d.className = 'j-ende';
    d.innerHTML = '<button type="button" class="j-plus" data-t="code">+ Code-Block</button><button type="button" class="j-plus" data-t="notiz">+ Notiz</button>';
    d.querySelectorAll('[data-t]').forEach(k => k.onclick = () => this.einfuegen(pos(), aufgabe, k.dataset.t));
    return d;
  },
  vorschauHtml() {
    let h = `<h1>Sitzung ${NR}: ${esc(ohne(META.titel))}</h1><p class="sub">Mein Lernjournal</p><pre>${esc(T.start.code)}</pre>`;
    for (const b of this.bloecke) {
      const t = TASKS.find(x => x.id === b.aufgabe);
      if (b.typ === 'aufgabe') h += `<h2>Aufgabe ${t.n}: ${esc(ohne(t.titel))}</h2><p><em>${esc(ohne(t.frage))}</em></p>`;
      else if (b.typ === 'code') {
        h += `<pre>${esc(kommentarKopf(b) + b.code)}</pre>`;
        const o = this.aus.get(b.id);
        if (o) { if (o.text) h += `<pre class="out">${esc(o.text)}</pre>`; for (const m of o.messages) h += `<pre class="out">${esc((m.kind === 'warning' ? 'Warnung: ' : m.kind === 'error' ? 'Fehler: ' : '') + m.text)}</pre>`; for (const u of o.bilder) h += `<img src="${u}" alt="Grafik">`; }
      } else if (b.typ === 'ergebnis') { const [kopf, ...z] = b.text.trim().split('\n'); h += `<p><strong>${esc(kopf)}</strong></p><ul>${z.filter(x => x.trim()).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`; }
      else if (b.text.trim()) h += b.text.trim().split(/\n{2,}/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
    }
    return h;
  },
  qmd() {
    const lbl = new Set();
    let s = '---\ntitle: "Sitzung ' + NR + ': ' + ohne(META.titel).replace(/"/g, "'") + '"\nsubtitle: "Mein Lernjournal"\nauthor: "Dein Name"\ndate: today\nlang: de\nformat:\n  html:\n    toc: true\n    embed-resources: true\nexecute:\n  error: true\n---\n\n'
      + '<!-- So wird daraus ein Dokument: Leg diese Datei in denselben Ordner wie die ALLBUS-Datei (ZA8831_v1-3-0.sav),\n     öffne sie in RStudio und klick oben auf „Render“. Fehler im Code halten das Rendern nicht an,\n     sie stehen dann im Dokument unter dem jeweiligen Block. -->\n\n';
    s += '```{r}\n#| label: start\n#| message: false\n# Liegt die ALLBUS-Datei im selben Ordner wie dieses Dokument, findet R sie.\n' + T.start.code.replace(/^# .*\n/, '') + '\n```\n';
    for (const b of this.bloecke) {
      const t = TASKS.find(x => x.id === b.aufgabe);
      if (b.typ === 'aufgabe') s += `\n## Aufgabe ${t.n}: ${ohne(t.titel)}\n\n*${ohne(t.frage)}*\n`;
      else if (b.typ === 'code') {
        const l0 = b.schritt || (b.aufgabe || 'eigen') + '-probieren'; let l = l0, k = 2; while (lbl.has(l)) l = l0 + '-' + k++; lbl.add(l);
        s += '\n```{r}\n#| label: ' + l + '\n' + kommentarKopf(b) + nurInteraktiv(b.code.replace(/\n+$/, '')) + '\n```\n';
      } else if (b.typ === 'ergebnis') { const [kopf, ...z] = b.text.trim().split('\n'); s += `\n**${kopf}**\n\n` + z.filter(x => x.trim()).map(x => '- ' + x).join('\n') + '\n'; }
      else if (b.text.trim()) s += '\n' + b.text.trim() + '\n';
    }
    return s;
  },
  html() {
    return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Sitzung ${NR}: ${esc(ohne(META.titel))} – Mein Lernjournal</title><style>body{max-width:820px;margin:30px auto;padding:0 20px;font:16px/1.6 Georgia,serif;color:#222}h1,h2{font-family:system-ui,sans-serif}h2{border-bottom:1px solid #ddd;padding-bottom:3px;margin-top:28px}pre{background:#f6f6f6;border-radius:6px;padding:8px 12px;font:13px/1.5 Menlo,monospace;overflow-x:auto}pre.out{background:#fff;border:1px solid #eee}img{max-width:100%}.sub{color:#666;margin-top:0}</style></head><body>${this.vorschauHtml()}</body></html>`;
  },
  laden_herunter(name, text, typ) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: typ })); a.download = name; document.body.append(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  },
  umschalten(m) { this.modus = m; document.querySelectorAll('.j-modus button').forEach(b => b.setAttribute('aria-pressed', b.dataset.modus === m)); this.zeichnen(); },
};

/* ---------- Arbeitsplatz rechts ---------- */
const Arbeitsplatz = {
  offen(an) {
    const ap = $('#arbeitsplatz'); const auf = an ?? ap.hidden;
    ap.hidden = !auf; document.body.classList.toggle('ap-offen', auf); $('#ap-auf').setAttribute('aria-expanded', auf);
    $('#ap-schleier').hidden = !auf;
    if (Auftrag) { if (auf) Auftrag.zeigen(); else Auftrag.zurueck(); }
    if (!auf) $('#ap-auf').focus();
  },
};
$('#ap-auf').onclick = () => { Arbeitsplatz.offen(true); $('#j-inhalt').focus?.(); };
$('#ap-zu').onclick = () => Arbeitsplatz.offen(false);
document.querySelectorAll('.j-modus button').forEach(b => b.onclick = () => Journal.umschalten(b.dataset.modus));
$('#j-qmd').onclick = () => Journal.laden_herunter(`sitzung${NR}.qmd`, Journal.qmd(), 'text/markdown');
$('#j-html').onclick = () => Journal.laden_herunter(`sitzung${NR}-lernjournal.html`, Journal.html(), 'text/html');
$('.ap-griff').addEventListener('pointerdown', e => {
  const g = e.currentTarget; g.setPointerCapture(e.pointerId);
  const zug = ev => document.documentElement.style.setProperty('--dock-w', Math.max(380, Math.min(innerWidth - 420, innerWidth - ev.clientX)) + 'px');
  const los = () => { g.removeEventListener('pointermove', zug); g.removeEventListener('pointerup', los); g.removeEventListener('pointercancel', los); };
  g.addEventListener('pointermove', zug); g.addEventListener('pointerup', los); g.addEventListener('pointercancel', los); e.preventDefault();
});

/* ---------- Bausteine einer Aufgabe ---------- */
function mehrKnoepfe(liste, wo) {
  if (!liste?.length) return '';
  const zeichen = { bild: '▦', warum: '?', code: '›_', grund: '↗' };
  return `<div class="mehr-reihe">${liste.map((m, i) => `<button type="button" class="mehr-knopf" data-art="${m.art}" data-mehr="${wo}:${i}" aria-expanded="false" aria-controls="mehr"><i aria-hidden="true">${zeichen[m.art]}</i>${esc(m.label)}</button>`).join('')}</div>`;
}
const MEHR = {};

/** Die Festlegung einer Aufgabe: Schritt „festlegen“ mit eigener Vorhersage oder einem Eintrag aus PREDICTIONS. */
function vorhersageVon(t) { const fs = t.schritte.find(x => x.art === 'festlegen'); return fs ? (fs.vorhersage || D.PREDICTIONS?.[fs.pred]) : null; }

function festlegen(s) {
  const p = s.vorhersage || D.PREDICTIONS[s.pred]; const div = document.createElement('div');
  const gewaehlt = S.wahl[p.id];
  if (p.options) {
    div.innerHTML = `<p class="s-text">${codeHtml(p.prompt)}</p><div class="wahl" role="group" aria-label="${esc(p.prompt)}">${p.options.map(o => `<button type="button" aria-pressed="${gewaehlt === o}">${esc(o)}</button>`).join('')}</div><p class="rueck" aria-live="polite"></p>`;
    div.querySelectorAll('.wahl button').forEach(b => b.onclick = () => {
      div.querySelectorAll('.wahl button').forEach(x => x.setAttribute('aria-pressed', x === b));
      S.wahl[p.id] = b.textContent; sichern(); fertig(s.id);
      $('.rueck', div).textContent = `Festgelegt: ${b.textContent}. Am Ende siehst du, ob es stimmt.`;
    });
  } else {
    div.innerHTML = `<p class="s-text"><label for="pr-${p.id}">${codeHtml(p.prompt)}</label></p><input id="pr-${p.id}" type="text" inputmode="decimal" value="${esc(gewaehlt || '')}" style="font:inherit;width:8em;border:1.5px solid #9a8f80;border-radius:8px;padding:2px 8px"> <button type="button" class="klein-knopf">Festlegen</button><p class="rueck" aria-live="polite"></p>`;
    $('button', div).onclick = () => { const v = $('input', div).value.trim(); if (!v) return; S.wahl[p.id] = v; sichern(); fertig(s.id); $('.rueck', div).textContent = `Festgelegt: ${v}${p.einheit ? ' ' + p.einheit : ''}.`; };
  }
  if (gewaehlt) $('.rueck', div).textContent = `Festgelegt: ${gewaehlt}.`;
  return div;
}

const zahl = v => { v = String(v).trim().replace(/\s/g, ''); if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, ''); return Number(v.replace(',', '.')); };
/** Prüft eine Antwort wie der Atlas (judgeWithFeedback aus dem React-Bündel: Lesarten von Zahlen, eigene Rückmeldungen).
    Ohne Bündel: einfache Prüfung. Ergebnis: { r: 'ok' | 'no' | 'offen', text } */
function pruefe(q, v) {
  const J = window.LernpfadPruefen;
  if (J) { const j = J(q, v ?? ''); return { r: j.result === 'right' ? 'ok' : j.result === 'wrong' ? 'no' : 'offen', text: j.text }; }
  if (v == null || v === '') return { r: 'offen', text: '' };
  const ok = q.kind === 'number' ? Math.abs(zahl(v) - q.target) <= (q.tolerance || 0) : v === q.target;
  return { r: ok ? 'ok' : 'no', text: ok ? q.right : q.hint };
}
function fragenBlock(s) {
  const qs = Array.isArray(s.fragen) ? s.fragen : D.QUESTIONS[s.fragen]; const f = document.createElement('form'); f.noValidate = true; f.className = 'fragen';
  f.innerHTML = qs.map(q => {
    const a = S.antwort[q.id] ?? '';
    const lab = codeHtml(q.label);
    const feld = q.kind === 'choice'
      ? `<fieldset><legend>${lab}</legend><div class="radios">${q.options.map(o => `<label><input type="radio" name="${q.id}" value="${esc(o.value)}" ${a === o.value ? 'checked' : ''}> ${codeHtml(o.label)}</label>`).join('')}</div></fieldset>`
      : `<label class="f-label" for="f-${q.id}">${lab}</label><br><input type="text" id="f-${q.id}" name="${q.id}" inputmode="decimal" autocomplete="off" value="${esc(a)}"${q.help ? ` aria-describedby="h-${q.id}"` : ''}>`;
    return `<div class="frage" data-q="${q.id}">${feld}${q.help ? `<p class="f-hilfe" id="h-${q.id}">${codeHtml(q.help)}</p>` : ''}<p class="r" aria-live="polite"></p></div>`;
  }).join('') + '<div><button type="submit" class="knopf">Prüfen</button></div>';
  const zeigen = () => {
    let alle = true;
    for (const q of qs) {
      const box = f.querySelector(`[data-q="${q.id}"]`); const { r, text } = pruefe(q, S.antwort[q.id]);
      box.className = 'frage' + (r === 'offen' ? '' : ' ' + r);
      const ohne = t => String(t || '').replace(/^\s*(Richtig|Stimmt|Genau|Korrekt|Noch nicht|Nicht ganz|Leider nicht|Fast)\s*[.:!,]?\s*/i, '');
      $('.r', box).innerHTML = r === 'ok' ? 'Richtig: ' + codeHtml(ohne(text)) : r === 'no' ? 'Noch nicht. ' + codeHtml(ohne(text)) : '';
      if (r !== 'ok') alle = false;
    }
    if (alle) fertig(s.id);
    // Auflösung der Festlegung (falls das Kapitel eine hat): allgemein oder je gewählter Möglichkeit.
    const t0 = ALLE_SCHRITTE.find(x => x.id === s.id).aufgabe, p0 = vorhersageVon(t0);
    let auf = $('.aufloesung', f); const atext = p0 && alle ? (p0.vergleich?.[S.wahl[p0.id]] || p0.aufloesung || p0.resolution || p0.resolve) : null;
    if (atext && !auf) { f.insertAdjacentHTML('beforeend', '<div class="aufloesung" aria-live="polite"></div>'); auf = $('.aufloesung', f); }
    if (auf) auf.innerHTML = atext ? `<b>Deine Festlegung:</b> ${esc(S.wahl[p0.id] || '–')}. ${codeHtml(atext)}` : '';
    const richtig = qs.filter(q => pruefe(q, S.antwort[q.id]).r === 'ok');
    let k = $('.ins-j', f);
    if (richtig.length && !k) { f.querySelector('button[type=submit]').insertAdjacentHTML('afterend', ' <button type="button" class="knopf hell ins-j">→ Ergebnisse ins Journal</button>'); k = $('.ins-j', f); }
    if (k) k.onclick = () => {
      const t = ALLE_SCHRITTE.find(x => x.id === s.id).aufgabe; const p = vorhersageVon(t);
      const zeilen = [];
      if (p && S.wahl[p.id]) zeilen.push(`Vermutet hatte ich: ${S.wahl[p.id]}.`);
      richtig.forEach(q => zeilen.push(`${(q.short || q.label).replace(/^./, c => c.toUpperCase())}: ${q.right}`));
      Journal.notiz(t.id, ohne('Ergebnis\n' + zeilen.join('\n')), 'ergebnis');
    };
  };
  f.onsubmit = ev => {
    ev.preventDefault();
    for (const q of qs) {
      const v = q.kind === 'choice' ? f.querySelector(`input[name="${q.id}"]:checked`)?.value : f.querySelector(`[name="${q.id}"]`).value.trim();
      if (v) S.antwort[q.id] = v; else delete S.antwort[q.id];
    }
    sichern(); zeigen();
    document.dispatchEvent(new CustomEvent('lernpfad:antworten', { detail: { schritt: s.id, antworten: { ...S.antwort } } }));
  };
  if (qs.some(q => S.antwort[q.id])) { if (document.readyState === 'complete') setTimeout(zeigen); else addEventListener('load', zeigen); }
  return f;
}

function aufgabeBauen(t) {
  const sec = document.createElement('section'); sec.className = 'aufgabe'; sec.id = t.id; sec.setAttribute('aria-labelledby', t.id + '-h');
  sec.innerHTML = `<div class="a-kopf"><span class="st m c7" aria-hidden="true">A${t.n}</span><h2 id="${t.id}-h">Aufgabe ${t.n}: ${esc(t.titel)}</h2><span class="art ${t.pflicht ? 'pflicht' : 'zusatz'}">${t.pflicht ? 'Pflicht' : 'Zusatz'}</span></div>
    <p class="a-frage">${esc(t.frage)}</p><p class="a-ziel"><b>Am Ende:</b> ${t.ziel}</p>
    ${t.info ? `<div class="a-info">${t.info}${mehrKnoepfe(t.infoMehr, t.id + '-info')}</div>` : ''}
    <ol class="schritte"></ol>`;
  if (t.infoMehr) MEHR[t.id + '-info'] = t.infoMehr;
  const ol = $('.schritte', sec);
  t.schritte.forEach((s, i) => {
    const li = document.createElement('li'); li.className = 'schritt'; li.id = s.id; li.dataset.step = s.id;
    li.innerHTML = `<span class="s-nr" aria-hidden="true"><span>${i + 1}</span></span><div class="s-kopf"><h3>${esc(s.titel)} ${s.neu ? '<span class="bekannt" style="background:var(--k);color:var(--kd)">neu heute</span>' : ''}${s.bekannt ? `<span class="bekannt">${esc(s.bekannt)}</span>` : ''}<span class="sr-only s-status"></span></h3></div>`;
    if (s.art === 'festlegen') li.append(festlegen(s));
    else {
      if (s.text) li.insertAdjacentHTML('beforeend', `<p class="s-text">${s.text}</p>`);
      if (s.art === 'code') (s.wk || []).forEach(k => li.append(codeBlock(k, s, t)));
      if (s.html) li.insertAdjacentHTML('beforeend', s.html);
      if (s.baustein) li.insertAdjacentHTML('beforeend', `<div class="baustein" data-baustein="${esc(s.baustein)}" data-schritt="${s.id}"></div>`);
      if (s.haken && s.art !== 'journal' && s.art !== 'lesen' && !KAP.typen?.[s.art]) {
        const lab = document.createElement('label'); lab.className = 'erledigt';
        lab.innerHTML = `<input type="checkbox" ${S.fertig[s.id] ? 'checked' : ''}> ${esc(typeof s.haken === 'string' ? s.haken : 'Erledigt')}`;
        $('input', lab).onchange = e => fertig(s.id, e.target.checked); li.append(lab);
      }
      if (s.art === 'journal') {
        const lab = document.createElement('label'); lab.className = 'erledigt';
        lab.innerHTML = `<input type="checkbox" ${S.fertig[s.id] ? 'checked' : ''}> Im Journal erledigt`;
        $('input', lab).onchange = e => fertig(s.id, e.target.checked); li.append(lab);
      }
      if (s.art === 'lesen') {
        const lab = document.createElement('label'); lab.className = 'erledigt';
        lab.innerHTML = `<input type="checkbox" ${S.fertig[s.id] ? 'checked' : ''}> Gelesen und verstanden`;
        $('input', lab).onchange = e => fertig(s.id, e.target.checked); li.append(lab);
      }
      if (KAP.typen?.[s.art]) { const el = KAP.typen[s.art](s, { fertig, S, sichern, D, esc, $, codeHtml }); if (el instanceof Node) li.append(el); }
      if (s.art === 'fragen') li.append(fragenBlock(s));
    }
    if (s.mehr) { MEHR[s.id] = s.mehr; li.insertAdjacentHTML('beforeend', mehrKnoepfe(s.mehr, s.id)); }
    ol.append(li);
  });
  const fuss = [
    { art: 'warum', label: 'Hilfe in 3 Stufen', titel: `Hilfe zu Aufgabe ${t.n}`, hilfe: t.id },
    { art: 'warum', label: 'R meldet einen Fehler', titel: 'R meldet einen Fehler', fehler: true },
    { art: 'warum', label: 'Ohne Grafik lösbar', titel: 'Ohne Grafik lösbar', html: t.ohneGrafik },
    { art: 'grund', label: `Aufgabe ${t.n} verstehen`, titel: '', grundlage: t.grund },
  ];
  MEHR[t.id + '-fuss'] = fuss;
  sec.insertAdjacentHTML('beforeend', `<section class="weiter-magst" aria-labelledby="${t.id}-frei-h"><h3 id="${t.id}-frei-h">Weiter, wenn du magst</h3><p>Für die Aufgabe nicht nötig. Hier entscheidest du selbst, wie du weitermachst – ohne fertige Vorlage.</p>
    ${FREI[t.id].map((f, i) => `<div class="frei"><span class="stufe-chip">${f.stufe}</span><p>${esc(f.text)}</p><div class="frei-knoepfe"><button type="button" class="ins-frei" data-frei="${t.id}:${i}">→ Journal</button><details><summary>Tipp</summary>${f.tipp}</details></div></div>`).join('')}</section>`);
  sec.insertAdjacentHTML('beforeend', (t.plenum ? `<div class="box-gruen" style="margin-top:10px"><b>Fürs Plenum:</b> ${esc(t.plenum)}</div>` : '') +
    `<div class="a-fuss"><span class="label">Bei Bedarf</span>${mehrKnoepfe(fuss, t.id + '-fuss').replace(/^<div class="mehr-reihe">|<\/div>$/g, '')}</div>` +
    (t.n < 4 ? `<div class="weiter"><a href="#a${t.n + 1}">Weiter zu Aufgabe ${t.n + 1} →</a></div>` : `<div class="weiter"><a href="#mitnehmen" data-tab="mitnehmen">Zum Mitnehmen →</a></div>`));
  return sec;
}

/* ---------- Leiste „Mehr“ ---------- */
let mehrAuslöser = null, denkAus = [];
const denkAbbauen = () => { denkAus.forEach(f => { try { f(); } catch { /* egal */ } }); denkAus = []; };
/** Inhalt eines ausgebauten Fensters. `bild`: Schlüssel eines Aufgabenbilds (D.SVG) oder Name eines Bilds aus „Verstehen“ (BILDER in inhalt.tsx). */
function denkHtml(o) {
  let h = `<section class="d-teil d-kurz"><h3>Kurz gesagt</h3><p>${o.kurz}</p></section>`;
  if (o.denken?.length) h += `<section class="d-teil d-denken"><h3>Dein Denkweg</h3><ol>${o.denken.map(x => `<li>${x}</li>`).join('')}</ol></section>`;
  if (o.bild) {
    h += `<section class="d-teil d-bild"><h3>Im Bild</h3>`;
    h += D.SVG?.[o.bild] ? `<div role="img" aria-label="${esc(D.ALT?.[o.bild] || '')}">${D.SVG[o.bild]}</div><p class="bildtext">${o.bildtext ?? BILD[o.bild]}</p>`
      : `<div class="d-react" data-denkbild="${esc(o.bild)}"></div>${o.bildtext ? `<p class="bildtext">${o.bildtext}</p>` : ''}`;
    h += `</section>`;
  }
  if (o.verwechslung) h += `<p class="d-verw"><b>Häufige Verwechslung:</b> ${o.verwechslung}</p>`;
  if (o.zusatz) h += `<p class="d-zusatz">${o.zusatz}</p>`;
  return h;
}
function mehrOeffnen(btn) {
  const [wo, i] = btn.dataset.mehr.split(/:(?=\d+$)/); const m = MEHR[wo][+i];
  if (m.grundlage) { tabWechsel('verstehen', m.grundlage); return; }
  const panel = $('#mehr'), inh = $('.mehr-inhalt', panel);
  document.querySelectorAll('.mehr-knopf[aria-expanded=true]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  if (mehrAuslöser === btn && !panel.hidden) { mehrZu(); return; }
  denkAbbauen(); panel.classList.toggle('breit', !!m.denk?.bild);
  btn.setAttribute('aria-expanded', 'true'); mehrAuslöser = btn;
  $('#mehr-titel').textContent = m.titel;
  let html = '';
  if (m.art === 'bild') html = `<div role="img" aria-label="${esc(D.ALT[m.key])}">${D.SVG[m.key]}</div><p class="bildtext">${BILD[m.key]}</p>`;
  if (m.denk) html += denkHtml(m.denk);
  if (m.html) html += `<p>${m.html}</p>`;
  if (m.hilfe) html += D.HINTS[m.hilfe].map((h, k) => `<details class="stufe"${k === 0 ? ' open' : ''}><summary><b>${['Stufe 1: Denkanstoß', 'Stufe 2: Wo schaue ich?', 'Stufe 3: Lösung'][k]}</b></summary><p style="margin:6px 0 0">${codeHtml(h)}</p></details>`).join('');
  if (m.fehler) html += `<table><thead><tr><th>R meldet</th><th>Das hilft</th></tr></thead><tbody>${D.ERROR_HELP.map(r => `<tr><td>${rich(r.says)}</td><td>${rich(r.helps)}</td></tr>`).join('')}</tbody></table>`;
  if (m.code) html += `<pre>${esc(m.code)}</pre><button type="button" class="knopf" data-konsole>→ Konsole</button> ${m.aufgabe ? '<button type="button" class="knopf hell" data-journal>→ Journal</button>' : ''}`;
  if (m.grund) html += `<a href="#${m.grund}" class="zur-grundlage" data-grund="${m.grund}">${m.denk ? 'Die ganze Erklärung in „Verstehen“ →' : 'Ausführlich im Teil „Verstehen“ →'}</a>`;
  inh.innerHTML = html;
  if (m.code) $('[data-konsole]', inh).onclick = () => Konsole.einfuegen(m.code);
  if (m.aufgabe) $('[data-journal]', inh).onclick = () => { mehrZu(); Journal.probierHolen(m.code, m.aufgabe, 'Weiterdenken: ' + m.idee); };
  const g = $('[data-grund]', inh); if (g) g.onclick = e => { e.preventDefault(); mehrZu(); tabWechsel('verstehen', m.grund); };
  panel.hidden = false; panel.focus(); inh.scrollTop = 0;
  inh.querySelectorAll('[data-denkbild]').forEach(el => { const aus = window.LernpfadBild?.zeige(el, el.dataset.denkbild); if (aus) denkAus.push(aus); else el.closest('.d-bild')?.remove(); });
}
function rich(parts) { return parts.map(p => typeof p === 'string' ? esc(p) : p.code ? `<code>${esc(p.code)}</code>` : esc(p.text)).join(''); }
function mehrZu() { denkAbbauen(); $('#mehr').hidden = true; if (mehrAuslöser) { mehrAuslöser.setAttribute('aria-expanded', 'false'); mehrAuslöser.focus(); } mehrAuslöser = null; }
document.addEventListener('click', e => {
  const fr = e.target.closest('[data-frei]');
  if (fr) { const [a, i] = fr.dataset.frei.split(':'); const f = FREI[a][+i]; Journal.probierHolen('', a, `${f.stufe}: ${f.text}`); }
});
document.addEventListener('click', e => { const b = e.target.closest('.mehr-knopf'); if (b) mehrOeffnen(b); if (e.target.closest('[data-datei]')) $('#datei').click(); });
$('#mehr .zu').onclick = mehrZu;
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#mehr').hidden) mehrZu(); });

/* ---------- Fortschritt ---------- */
let jetzt = null;
function fertig(id, wert = true) {
  if (wert) S.fertig[id] = true; else delete S.fertig[id];
  sichern(); fortschritt();
}
function fortschritt() {
  document.querySelectorAll('.schritt').forEach(li => {
    const f = !!S.fertig[li.id]; li.classList.toggle('fertig', f); li.classList.toggle('aktiv', li.id === jetzt);
    const st = $('.s-status', li); if (st) st.textContent = f ? ' (erledigt)' : '';
  });
  const gesamt = ALLE_SCHRITTE.length, fertigZahl = ALLE_SCHRITTE.filter(s => S.fertig[s.id]).length;
  const aktTask = (ALLE_SCHRITTE.find(s => s.id === jetzt) || ALLE_SCHRITTE[0]).aufgabe;
  $('#f-aufgaben').innerHTML = `<h2>Dein Fortschritt</h2>
    <div class="balken" role="progressbar" aria-label="Erledigte Schritte" aria-valuemin="0" aria-valuemax="${gesamt}" aria-valuenow="${fertigZahl}"><div style="width:${fertigZahl / gesamt * 100}%"></div></div>
    <p class="f-zahl">${fertigZahl} von ${gesamt} Schritten · Pflicht: ${TASKS.filter(t => t.pflicht && t.schritte.every(s => S.fertig[s.id])).length} von ${TASKS.filter(t => t.pflicht).length} Aufgaben</p>
    ${(() => { const n = Journal.bloecke.filter(b => b.frei).length; return n ? `<p class="f-frei">+ ${n} ${n === 1 ? 'eigener Versuch' : 'eigene Versuche'} im Journal</p>` : ''; })()}
    <ol class="r-liste">${TASKS.map(t => {
      const f = t.schritte.filter(s => S.fertig[s.id]).length, alle = f === t.schritte.length, akt = t === aktTask;
      return `<li class="r-aufgabe${akt ? ' aktiv' : ''}${alle ? ' komplett' : ''}"><a href="#${t.id}"${akt ? ' aria-current="location"' : ''}><span class="st c7" aria-hidden="true">A${t.n}</span><span>${esc(t.titel)}</span><small>${alle ? '✓' : `${f}/${t.schritte.length}`}</small>
        <span class="punkte" aria-hidden="true">${t.schritte.map(s => `<span class="${S.fertig[s.id] ? 'f' : ''}"></span>`).join('')}</span></a>
        ${akt ? `<ol class="r-schritte">${t.schritte.map(s => `<li class="${S.fertig[s.id] ? 'f' : ''}${s.id === jetzt ? ' jetzt' : ''}"><a href="#${s.id}"${s.id === jetzt ? ' aria-current="step"' : ''}>${esc(s.titel)}<span class="sr-only">${S.fertig[s.id] ? ', erledigt' : ''}</span></a></li>`).join('')}</ol>` : ''}</li>`;
    }).join('')}</ol>
    <div class="r-mehr" data-k="${kurzStand() ?? ''}"><a href="#p-verstehen" data-tab="verstehen">Verstehen: jede Aufgabe erklärt</a><a href="#p-mitnehmen" data-tab="mitnehmen">Mitnehmen: Wichtigstes, Selbsttest, Lernjournal, Skript</a></div>`;
}
function kurzStand() {
  const s = ALLE_SCHRITTE.find(x => x.id === jetzt) || ALLE_SCHRITTE[0]; const t = s.aufgabe;
  const nr = t.schritte.findIndex(x => x.id === s.id) + 1, gesamt = ALLE_SCHRITTE.length, f = ALLE_SCHRITTE.filter(x => S.fertig[x.id]).length;
  $('#mini-fortschritt').innerHTML = `<span class="st c7">A${t.n}</span><span class="mf-text"><b>Schritt ${nr} von ${t.schritte.length}:</b> ${esc(s.titel)}</span><span class="mf-balken"><span style="width:${f / gesamt * 100}%"></span></span><span class="mf-zahl">${f}/${gesamt}</span>`;
  if (Auftrag && !Auftrag.li) Auftrag.kopf(s.id);
}
function beobachten() {
  const io = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting && e.target.id !== jetzt) { jetzt = e.target.id; fortschritt(); }
  }, { rootMargin: '-25% 0px -65% 0px' });
  document.querySelectorAll('.schritt').forEach(li => io.observe(li));
}

/* ---------- Reiter ---------- */
function tabWechsel(name, ziel) {
  // Unter 1280 px deckt das Journal die Seite zu: Wer zu „Verstehen“ oder „Mitnehmen“ springt, soll das Ziel auch sehen.
  if (name !== 'aufgaben' && !$('#arbeitsplatz').hidden && matchMedia('(max-width:1279px)').matches) Arbeitsplatz.offen(false);
  ['aufgaben', 'verstehen', 'mitnehmen'].forEach(n => {
    const an = n === name; const t = $('#tab-' + n);
    t.setAttribute('aria-selected', an); t.tabIndex = an ? 0 : -1; $('#p-' + n).hidden = !an;
  });
  const v = name === 'verstehen'; $('#f-aufgaben').hidden = v; $('#f-verstehen').hidden = !v; document.body.classList.toggle('reiter-verstehen', v);
  if (v && window.Verstehen) { Verstehen.zeige(ziel); return; }
  if (ziel) { const el = document.getElementById(ziel); if (el) { el.scrollIntoView({ block: 'start' }); el.classList.remove('blitz'); void el.offsetWidth; el.classList.add('blitz'); } }
  else window.scrollTo({ top: 0 });
}
document.querySelectorAll('.reiter [role=tab]').forEach((t, i, alle) => {
  t.onclick = () => tabWechsel(t.id.slice(4));
  t.onkeydown = e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = alle[(i + (e.key === 'ArrowRight' ? 1 : alle.length - 1)) % alle.length]; n.focus(); n.click(); } };
});
document.addEventListener('click', e => {
  const a = e.target.closest('[data-tab]'); if (a) { e.preventDefault(); tabWechsel(a.dataset.tab); return; }
  const l = e.target.closest('a[href^="#a"]'); if (l && $('#p-aufgaben').hidden) { tabWechsel('aufgaben'); setTimeout(() => document.querySelector(l.getAttribute('href'))?.scrollIntoView()); }
});

/* ---------- R im Browser ---------- */
const R = {
  w: null, bereit: false, datei: null, start: null,
  status(t, ok) { const s = $('#r-status'); s.textContent = t; s.classList.toggle('bereit', !!ok); },
  async hoch() {
    if (this.start) return this.start;
    this.start = (async () => {
      this.status('R startet …');
      const { WebR } = await import('https://webr.r-wasm.org/v0.6.1/webr.mjs');
      const w = new WebR(); await w.init();
      this.status('Pakete werden geladen …');
      const repos = ['https://yannickdiehl.r-universe.dev', 'https://repo.r-wasm.org'];
      await w.evalRVoid(`options(repos = c(${repos.map(r => `"${r}"`).join(', ')}))`);
      await w.installPackages(['mariposa', 'haven', 'ggplot2', 'dplyr', 'tidyr'], { quiet: true, repos });
      await w.evalRVoid('suppressMessages({library(dplyr); library(tidyr); library(ggplot2); library(haven); library(mariposa)}); options(width = 80)');
      await w.evalRVoid(`.umgebung <- function() {
        nm <- ls(globalenv()); if (!length(nm)) return(character(0))
        vapply(nm, function(n) { x <- get(n, envir = globalenv())
          art <- if (inherits(x, "ggplot")) "Grafik" else if (is.data.frame(x)) "Daten" else if (is.function(x)) "Funktion" else if (is.factor(x)) "Faktor" else if (is.numeric(x)) "Zahlen" else if (is.character(x)) "Text" else if (is.logical(x)) "Wahr/Falsch" else class(x)[1]
          wert <- if (inherits(x, "ggplot")) "Grafik: mit print() oder Namen zeigen" else if (is.data.frame(x)) paste0(format(nrow(x), big.mark = "."), " Zeilen, ", ncol(x), " Variablen") else if (is.function(x)) "function(...)" else if (is.atomic(x)) paste0("[", length(x), "] ", paste(utils::head(format(x), 5), collapse = " "), if (length(x) > 5) " ..." else "") else paste(class(x), collapse = ", ")
          paste(n, art, wert, sep = "\\t") }, "", USE.NAMES = FALSE) }`);
      this.w = w; setTimeout(() => { AC.laden(); Hilfe.laden(); }); return w;
    })();
    return this.start;
  },
  async dateiLaden(bytes) {
    this.datei = bytes; $('#datei-hinweis').hidden = true;
    const w = await this.hoch();
    this.status('ALLBUS wird eingelesen …');
    await w.FS.writeFile('/home/web_user/ZA8831_v1-3-0.sav', new Uint8Array(bytes.slice(0)));
    await w.evalRVoid('.za8831 <- read_spss("ZA8831_v1-3-0.sav"); if (!exists("allbus", envir = globalenv(), inherits = FALSE)) allbus <- .za8831');
    this.bereit = true; this.status('R bereit, ALLBUS geladen', true); AC.variablenLaden();
    Konsole.umgebung();
  },
  async lauf(code, konsole) {
    const w = await this.hoch();
    if (!this.bereit && this.datei) await this.laden;
    code = geradeZeichen(code);
    code = code.replace(/^[ \t]*library\((tidyverse|mariposa)\)[ \t]*(\r?\n|$)/gm, '');
    if (!konsole) code = code.replace(/^[ \t]*allbus <- read_spss\(.*\)[ \t]*(\r?\n|$)/m, '');
    const sh = await new w.Shelter();
    try {
      const opt = { withAutoprint: true, captureStreams: true, captureConditions: true, throwJsException: false, captureGraphics: { width: 700, height: 420 } };
      const r = await sh.captureR(code, opt);
      let text = ''; const messages = [];
      for (const x of r.output) {
        if (x.type === 'stdout' || x.type === 'stderr') text += x.data + '\n';
        else {
          let m = '';
          try { m = String(await (await sh.evalR('paste(conditionMessage(cond), collapse = "\\n")', { env: { cond: x.data } })).toString()); } catch { m = '(Meldung)'; }
          messages.push({ kind: x.type === 'error' ? 'error' : x.type === 'warning' ? 'warning' : 'message', text: m.replace(/\u001b\[[0-9;?]*[A-Za-z]/g, '').trim() });
        }
      }
      return { text: text.replace(/\u001b\[[0-9;?]*[A-Za-z]/g, '').replace(/\n$/, ''), messages, images: r.images || [] };
    } catch (e) {
      return { text: '', messages: [{ kind: 'error', text: String(e.message || e) }], images: [] };
    } finally { sh.purge(); }
  },
};

/* Datei: wählen oder aus dem Browser-Speicher holen (nur für den Prototyp) */
const IDB = {
  db() { return new Promise((ok, no) => { const r = indexedDB.open('statistikatlas-allbus', 1); r.onupgradeneeded = () => r.result.createObjectStore('d'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }); },
  async get() { try { const db = await this.db(); return await new Promise(ok => { const q = db.transaction('d').objectStore('d').get('sav'); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); }); } catch { return null; } },
  async put(b) { try { const db = await this.db(); db.transaction('d', 'readwrite').objectStore('d').put(b, 'sav'); } catch { /* egal */ } },
};
$('#datei').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  if (!/\.sav$/i.test(f.name)) { R.status('Das ist keine .sav-Datei. Bitte die ALLBUS-Datei ZA8831_v1-3-0.sav wählen.'); e.target.value = ''; return; }
  const b = await f.arrayBuffer(); IDB.put(b);
  R.laden = R.dateiLaden(b).catch(err => R.status('Fehler: ' + err.message));
};

/* ---------- Konsole ---------- */
const Konsole = {
  verlauf: [], pos: 0, plots: [], plotNr: 0,
  offen() { Arbeitsplatz.offen(true); $('#arbeitsplatz').classList.remove('unten-zu'); $('#unten-klapp').textContent = '▾'; $('#unten-klapp').setAttribute('aria-expanded', 'true'); kTab('konsole'); $('#k-text').focus(); },
  einfuegen(code) {
    this.offen(true); const ta = $('#k-text'); ta.value = code.replace(/\n+$/, ''); this.groesse(); ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    this.info('Code übernommen. Mit Enter ausführen, vorher gern anpassen.');
  },
  groesse() { const ta = $('#k-text'); ta.rows = Math.min(6, ta.value.split('\n').length); },
  info(t) { const p = document.createElement('p'); p.className = 'info'; p.innerHTML = t; $('#k-log').append(p); this.unten(); },
  unten() { const l = $('#k-log'); l.scrollTop = l.scrollHeight; },
  async ausfuehren() {
    const ta = $('#k-text'); let code = ta.value; if (!code.trim()) return;
    this.verlauf.push(code); this.pos = this.verlauf.length; ta.value = ''; this.groesse();
    const log = $('#k-log');
    const ein = document.createElement('div'); ein.className = 'ein'; ein.textContent = code.split('\n').map((z, i) => (i ? '+ ' : '> ') + z).join('\n'); log.append(ein);
    Umgebung.merken(code);
    const hb = hilfeBefehl(code);
    if (hb) { this.info(hb.text.startsWith('Datenansicht') ? `${esc(hb.text)} geöffnet.` : `${esc(hb.text)} → Reiter <b>Help</b>.`); hb.aktion(); if (!hb.rest) return; code = hb.rest; }
    if (!R.datei) { this.info('Erst die ALLBUS-Datei wählen. <button type="button" class="klein-knopf" data-datei>Datei wählen</button>'); return; }
    if (!R.bereit) this.info('R startet …');
    const o = await R.lauf(code, true);
    if (o.text) { const p = document.createElement('pre'); p.className = 'aus'; p.textContent = o.text; log.append(p); }
    for (const m of o.messages) { const p = document.createElement('div'); p.className = m.kind; p.textContent = (m.kind === 'error' ? 'Fehler: ' : m.kind === 'warning' ? 'Warnung: ' : '') + m.text; log.append(p); }
    if (o.images.length) { this.plots.push(...o.images); this.plotNr = this.plots.length - 1; this.plotZeigen(); this.info('Grafik → Reiter <b>Plots</b>.'); kTab('plots'); }
    this.unten(); this.umgebung(true);
  },
  plotZeigen() {
    const c = $('#plot-bild'), b = this.plots[this.plotNr]; if (!b) return;
    c.hidden = false; $('#plot-leer').hidden = true; c.width = b.width; c.height = b.height; c.getContext('2d').drawImage(b, 0, 0);
    c.setAttribute('role', 'img'); c.setAttribute('aria-label', `Grafik ${this.plotNr + 1} aus der Konsole`);
    $('#plot-nav').hidden = this.plots.length < 2; $('#plot-nr').textContent = `${this.plotNr + 1} von ${this.plots.length}`;
    $('#plot-zahl').textContent = `(${this.plots.length})`;
  },
  umgebung(markieren) { return Umgebung.laden(markieren); },

};
function kTab(n) {
  $('#arbeitsplatz').classList.remove('unten-zu'); $('#unten-klapp').textContent = '▾'; $('#unten-klapp').setAttribute('aria-expanded', 'true');
  ['konsole', 'plots', 'hilfe'].forEach(x => { const an = x === n; $('#kt-' + x).setAttribute('aria-selected', an); $('#kt-' + x).tabIndex = an ? 0 : -1; $('#kp-' + x).hidden = !an; });
}
$('#kt-konsole').onclick = () => kTab('konsole'); $('#kt-plots').onclick = () => kTab('plots'); $('#kt-hilfe').onclick = () => kTab('hilfe');
$('#h-zurueck').onclick = () => Hilfe.zurueck();
$('#h-home').onclick = () => Hilfe.home();
$('#h-such').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const t = Hilfe.suche(e.target.value); if (t && e.target.value.trim()) Hilfe.thema(t.alias, t.pkg); } });
$('#h-such').addEventListener('input', e => { if (Hilfe.bereit) Hilfe.suche(e.target.value); });
$('#h-gross').onclick = e => { const g = $('#arbeitsplatz').classList.toggle('unten-gross'); e.currentTarget.setAttribute('aria-pressed', g); e.currentTarget.textContent = g ? '⤡ kleiner' : '⤢ größer'; };
$('#k-los').onclick = () => Konsole.ausfuehren();
$('#k-text').addEventListener('input', () => Konsole.groesse());
Tasten.an($('#k-text'), () => Konsole.ausfuehren(), { konsole: true });
$('#k-text').addEventListener('keydown', e => {
  const ta = e.target;
  if (e.key === 'ArrowUp' && !ta.value.slice(0, ta.selectionStart).includes('\n') && Konsole.verlauf.length) { e.preventDefault(); Konsole.pos = Math.max(0, Konsole.pos - 1); ta.value = Konsole.verlauf[Konsole.pos]; Konsole.groesse(); }
  if (e.key === 'ArrowDown' && !ta.value.slice(ta.selectionEnd).includes('\n') && Konsole.verlauf.length) { e.preventDefault(); Konsole.pos = Math.min(Konsole.verlauf.length, Konsole.pos + 1); ta.value = Konsole.verlauf[Konsole.pos] || ''; Konsole.groesse(); }
});
$('#plot-zurueck').onclick = () => { Konsole.plotNr = Math.max(0, Konsole.plotNr - 1); Konsole.plotZeigen(); };
$('#plot-vor').onclick = () => { Konsole.plotNr = Math.min(Konsole.plots.length - 1, Konsole.plotNr + 1); Konsole.plotZeigen(); };
$('#env-besen').innerHTML = ICON.besen; $('#env-neu').innerHTML = ICON.neu;
$('#env-besen').onclick = () => Umgebung.leeren();
$('#env-neu').onclick = () => Umgebung.laden();
$('#env-such').addEventListener('input', e => { Umgebung.suche = e.target.value; Umgebung.malen(); });
document.querySelectorAll('[data-env-ansicht]').forEach(b => b.onclick = () => { Umgebung.ansicht = b.dataset.envAnsicht; document.querySelectorAll('[data-env-ansicht]').forEach(x => x.setAttribute('aria-pressed', x === b)); Umgebung.malen(); });
$('#envt-env').onclick = () => Umgebung.tab('env'); $('#envt-hist').onclick = () => Umgebung.tab('hist');
$('#viewer .zu').onclick = () => { $('#viewer').hidden = true; };
$('#viewer-rvor').onclick = () => { Umgebung.v.r1 += Umgebung.v.schritt; Umgebung.viewLaden(); };
$('#viewer-rzurueck').onclick = () => { Umgebung.v.r1 = Math.max(1, Umgebung.v.r1 - Umgebung.v.schritt); Umgebung.viewLaden(); };
$('#viewer-cvor').onclick = () => { Umgebung.v.c1 += Umgebung.v.breite; Umgebung.viewLaden(); };
$('#viewer-czurueck').onclick = () => { Umgebung.v.c1 = Math.max(1, Umgebung.v.c1 - Umgebung.v.breite); Umgebung.viewLaden(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#viewer').hidden) $('#viewer').hidden = true; });
$('#j-einfuegen').outerHTML = Tasten.leiste('Einfügen ins Journal');
$('#k-einfuegen').outerHTML = Tasten.leiste('Einfügen in die Konsole');
$('#unten-klapp').onclick = e => { const zu = $('#arbeitsplatz').classList.toggle('unten-zu'); e.currentTarget.setAttribute('aria-expanded', !zu); e.currentTarget.textContent = zu ? '▴' : '▾'; };
$('#ap-zurueck').onclick = () => Arbeitsplatz.offen(false);
if (innerHeight < 900 || matchMedia('(pointer:coarse)').matches) { $('#arbeitsplatz').classList.add('unten-zu'); $('#unten-klapp').setAttribute('aria-expanded', 'false'); $('#unten-klapp').textContent = '▴'; }

/* ---------- Umschalter Vorlagen ---------- */
function vorlagenModus(m) {
  S.vorlage = m; sichern();
  document.querySelectorAll('[data-vorlage]').forEach(b => b.setAttribute('aria-pressed', b.dataset.vorlage === m));
  const y = scrollY; const box = $('#aufgaben'); box.innerHTML = '';
  TASKS.forEach(t => box.append(aufgabeBauen(t)));
  beobachten(); fortschritt(); Journal.sichern(); scrollTo(0, y);
}
document.querySelectorAll('[data-vorlage]').forEach(b => b.onclick = () => vorlagenModus(b.dataset.vorlage));

/* ---------- Start ---------- */
const box = $('#aufgaben');
TASKS.forEach(t => box.append(aufgabeBauen(t)));
document.querySelectorAll('[data-vorlage]').forEach(b => b.setAttribute('aria-pressed', b.dataset.vorlage === (S.vorlage || 'mit')));

jetzt = ALLE_SCHRITTE[0].id; fortschritt(); beobachten();
Konsole.info('Zum schnellen Ausprobieren. Was hier läuft, kommt nicht ins Journal. Was du mit <code>&lt;-</code> speicherst, steht im Environment.');
Journal.laden(); Journal.zeichnen(); Journal.sichern();
(async () => {
  const b = await IDB.get();
  if (b) { R.laden = R.dateiLaden(b).catch(err => R.status('Fehler: ' + err.message)); }
  else $('#datei-hinweis').hidden = false;
})();

/* ---------- Schnittstelle für den Reiter „Verstehen“ (verstehen.js) ---------- */
window.K4Vorlage = {
  /** Ein React-Baustein in einer Aufgabe meldet einen Schritt als erledigt. */
  fertig(id) { fertig(id); },
  /** Für „Mitnehmen“: was im Lernjournal steht, je Aufgabe. */
  journalStand() {
    const B = Journal.bloecke;
    return {
      aufgaben: TASKS.map(t => ({ n: t.n, titel: ohne(t.titel), code: B.filter(b => b.aufgabe === t.id && b.typ === 'code').length, notizen: B.filter(b => b.aufgabe === t.id && (b.typ === 'notiz' || b.typ === 'ergebnis') && (b.text || '').trim()).length })),
      frei: B.filter(b => b.frei).length, leer: !B.some(b => b.typ !== 'aufgabe'),
    };
  },
  download(art) { $(art === 'qmd' ? '#j-qmd' : '#j-html').click(); },
  /** Bild aus den Aufgaben, mit Bildunterschrift. */
  bild(el, key) { if (!el || !D.SVG[key]) return; el.innerHTML = `<div class="grafik" role="img" aria-label="${esc(D.ALT[key])}">${D.SVG[key]}</div><p class="bildtext">${BILD[key] || ''}</p>`; },
  /** Code-Block statt Werkstatt: ansehen, kopieren, in die Konsole holen. */
  vorlage(el, key) {
    const v = T[key]; if (!v || !el) return; const p = marken(v.code);
    const start = key === 'start';
    el.innerHTML = `<div class="cb"><div class="cb-kopf"><span class="cb-titel">${esc(v.title)}</span>
      ${start ? '<span class="cb-notiz">steht schon oben im Journal</span>' : '<span class="cb-notiz">zum Lesen</span>'}<button type="button" data-a="kopie">Kopieren</button></div>
      <pre aria-label="${esc(v.title)}">${malen(p.code, p.ranges).replace(/\n$/, '')}</pre></div>`;
    el.querySelector('[data-a=kopie]').onclick = async ev => { try { await navigator.clipboard.writeText(p.code); ev.target.textContent = 'Kopiert ✓'; setTimeout(() => ev.target.textContent = 'Kopieren', 1500); } catch { /* egal */ } };
  },
};

/* ---------- Ziehgriffe: Konsole/Plots/Help und Environment in der Höhe verstellen ---------- */
(() => {
  const ap = $('#arbeitsplatz'), ZKEY = PFX + '-hoehen-v1';
  let h = {}; try { h = JSON.parse(localStorage.getItem(ZKEY) || '{}'); } catch { /* leer */ }
  const merken = () => { try { localStorage.setItem(ZKEY, JSON.stringify(h)); } catch { /* egal */ } };
  // Feste Teile des Journals (Kopf, Leisten) ohne Environment und Blöcke; vom Journal bleiben immer mind. 90 px Blöcke sichtbar.
  const fest = () => [...$('.journal').children].filter(c => !c.matches('.rs-env, #j-inhalt')).reduce((n, c) => n + c.getBoundingClientRect().height, 0);
  const setzen = {
    unten(px, oeffnen = true) {
      const max = ap.clientHeight - fest() - 70 - 90; px = Math.round(Math.max(90, Math.min(max, px)));
      ap.style.setProperty('--unten-h', px + 'px'); h.unten = px;
      if (oeffnen && ap.classList.contains('unten-zu')) { ap.classList.remove('unten-zu'); $('#unten-klapp').textContent = '▾'; $('#unten-klapp').setAttribute('aria-expanded', 'true'); }
      $('#zieh-unten').setAttribute('aria-valuenow', px);
      if (h.env) setzen.env(h.env, false);
    },
    env(px, merk = true) {
      const platz = $('.journal').clientHeight - fest() - 90;
      px = Math.round(Math.max(70, Math.min(platz, px)));
      ap.style.setProperty('--env-h', px + 'px'); ap.classList.add('env-fest'); if (merk) h.env = px;
      $('#zieh-env').setAttribute('aria-valuenow', px);
    },
  };
  const hoehe = { unten: () => $('.unten').getBoundingClientRect().height, env: () => $('.rs-env').getBoundingClientRect().height };
  function griff(el, art, richtung) {
    el.addEventListener('pointerdown', e => {
      e.preventDefault(); el.setPointerCapture(e.pointerId);
      const y0 = e.clientY, h0 = hoehe[art](); el.classList.add('zieht'); document.body.classList.add('zieht-gerade');
      const zug = ev => setzen[art](h0 + richtung * (ev.clientY - y0));
      const los = () => { el.classList.remove('zieht'); document.body.classList.remove('zieht-gerade'); el.removeEventListener('pointermove', zug); merken(); };
      el.addEventListener('pointermove', zug); el.addEventListener('pointerup', los, { once: true }); el.addEventListener('pointercancel', los, { once: true });
    });
    el.addEventListener('keydown', e => {
      const d = { ArrowUp: -1, ArrowDown: 1 }[e.key]; if (!d && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault();
      if (e.key === 'Home') setzen[art](richtung > 0 ? 0 : 1e5); else if (e.key === 'End') setzen[art](richtung > 0 ? 1e5 : 0);
      else setzen[art](hoehe[art]() + richtung * d * 30);
      merken();
    });
    el.addEventListener('dblclick', () => { delete h[art]; merken(); if (art === 'unten') ap.style.removeProperty('--unten-h'); else { ap.style.removeProperty('--env-h'); ap.classList.remove('env-fest'); } });
  }
  griff($('#zieh-unten'), 'unten', -1);   // nach oben ziehen = Konsole größer
  griff($('#zieh-env'), 'env', 1);        // nach unten ziehen = Environment größer
  new ResizeObserver(() => { if (ap.hidden) return; if (h.unten) setzen.unten(h.unten, false); if (h.env) setzen.env(h.env, false); }).observe(ap);
})();

/* ---------- Auftragskarte: auf schmalen Bildschirmen reist der aktuelle Schritt mit ins Journal ---------- */
var Auftrag = { // var: wird schon vor dieser Zeile (beim Aufbau) abgefragt
 
  id: null, li: null, platz: null, schmal: matchMedia('(max-width:1279px)'),
  aktiv() { return this.schmal.matches && !$('#arbeitsplatz').hidden; },
  /** Holt den echten Schritt (mit Vorlage, Fragen, Knöpfen) in die Karte; der Platz in der Aufgabe wird gemerkt. */
  zeigen(id) {
    if (!this.aktiv()) { this.zurueck(); return; }
    id = id || this.id || jetzt || ALLE_SCHRITTE[0].id;
    if (this.li && this.id === id) { this.kopf(id); return; }
    this.zurueck();
    const li = document.getElementById(id); if (!li) return;
    this.platz = document.createComment('auftrag'); li.before(this.platz);
    $('#af-inhalt').append(li); this.li = li; this.id = id;
    $('#af-inhalt').scrollTop = 0; this.kopf(id);
  },
  zurueck() { if (this.li && this.platz) this.platz.replaceWith(this.li); this.li = this.platz = null; },
  kopf(id) {
    const i = ALLE_SCHRITTE.findIndex(s => s.id === id); if (i < 0) return;
    const s = ALLE_SCHRITTE[i], t = s.aufgabe, nr = t.schritte.findIndex(x => x.id === s.id) + 1;
    $('#af-titel').innerHTML = `<span class="st s c7" aria-hidden="true">A${t.n}</span><span class="af-text"><b>Schritt ${nr} von ${t.schritte.length}:</b> ${esc(s.titel)}${S.fertig[s.id] ? ' <span class="af-ok">✓</span>' : ''}</span><span class="af-auf" aria-hidden="true">▾</span>`;
    $('#af-zurueck').disabled = i === 0; $('#af-vor').disabled = i === ALLE_SCHRITTE.length - 1;
    this.knopf(s);
  },
  /** Beschriftung des Aufklapp-Knopfs je nach Schritt. */
  knopf(s = ALLE_SCHRITTE.find(x => x.id === (this.id || jetzt))) {
    const offen = $('#ap-jetzt').classList.contains('offen'), b = $('#af-mehr'); if (!s) return;
    const was = { fragen: 'Fragen beantworten', festlegen: 'Festlegen', achse: 'Frage beantworten', raetsel: 'Rätsel lösen', lesen: 'Ganz lesen', code: 'Vorlage und Hilfen zeigen' }[s.art] || 'Ganz zeigen';
    b.textContent = offen ? '▴ Weniger zeigen' : `▾ ${was}`; b.setAttribute('aria-expanded', offen);
  },
  blaettern(d) {
    const i = ALLE_SCHRITTE.findIndex(s => s.id === (this.id || jetzt)), n = ALLE_SCHRITTE[i + d]; if (!n) return;
    jetzt = n.id; this.zeigen(n.id); fortschritt();
  },
  auf(an) { const k = $('#ap-jetzt'); an = an ?? !k.classList.contains('offen'); k.classList.toggle('offen', an); $('#af-titel').setAttribute('aria-expanded', an); this.knopf(); },
};
$('#af-titel').onclick = () => Auftrag.auf();
$('#af-mehr').onclick = () => Auftrag.auf();
$('#af-zurueck').onclick = () => Auftrag.blaettern(-1);
$('#af-vor').onclick = () => Auftrag.blaettern(1);
Auftrag.schmal.addEventListener('change', () => Auftrag.zeigen());
// Wer in einen Journal-Block tippt, bekommt den passenden Schritt in die Karte.
$('#j-inhalt').addEventListener('focusin', e => {
  if (!Auftrag.aktiv()) return;
  const el = e.target.closest('.jc[id], .jn[id]'); const b = el && Journal.bloecke.find(x => x.id === el.id); if (!b) return;
  const t = TASKS.find(x => x.id === b.aufgabe);
  const ziel = b.schritt || (b.typ === 'ergebnis' && t ? t.schritte.find(x => x.art === 'fragen')?.id : null);
  if (ziel && ziel !== Auftrag.id) { jetzt = ziel; Auftrag.zeigen(ziel); fortschritt(); }
});
Auftrag.kopf(ALLE_SCHRITTE[0].id);

/* ---------- Platz sparen: Environment einklappen, Bildschirmtastatur, Speichern-Menü ---------- */
(() => {
  const ap = $('#arbeitsplatz'), KEY = 'lernpfad-envzu-v1';
  const envZu = zu => { ap.classList.toggle('env-zu', zu); $('#env-klapp').setAttribute('aria-expanded', !zu); $('#env-klapp').textContent = zu ? '▸' : '▾'; };
  let zu = null; try { zu = JSON.parse(localStorage.getItem(KEY)); } catch { /* leer */ }
  envZu(zu ?? false);
  $('#env-klapp').onclick = () => { const z = !ap.classList.contains('env-zu'); envZu(z); try { localStorage.setItem(KEY, JSON.stringify(z)); } catch { /* egal */ } };
  // iPad: Geht die Bildschirmtastatur auf, treten Environment, unterer Bereich und Auftragskarte zurück.
  const vv = window.visualViewport;
  if (vv) {
    const pruefen = () => {
      const tippt = matchMedia('(pointer:coarse)').matches && vv.height < document.documentElement.clientHeight * 0.8 && /^(TEXTAREA|INPUT)$/.test(document.activeElement?.tagName || '');
      document.body.classList.toggle('tastatur', tippt);
      if (tippt) document.activeElement.scrollIntoView({ block: 'nearest' });
    };
    vv.addEventListener('resize', pruefen); document.addEventListener('focusin', () => setTimeout(pruefen, 300)); document.addEventListener('focusout', () => setTimeout(pruefen, 300));
  }
  // Speichern-Menü schließt bei Klick daneben.
  document.addEventListener('click', e => { const d = $('.j-speichern'); if (d?.open && !e.target.closest('.j-speichern')) d.open = false; });
})();

// Einfüge-Leisten: Hinweis am Rand, wenn sie seitlich weitergehen
(() => { const ro = new ResizeObserver(es => es.forEach(e => { const el = e.target; el.classList.toggle('weiter', el.scrollWidth > el.clientWidth + 4 && el.scrollLeft + el.clientWidth < el.scrollWidth - 4); }));
  document.querySelectorAll('.einfuegen').forEach(el => { ro.observe(el); el.addEventListener('scroll', () => el.classList.toggle('weiter', el.scrollLeft + el.clientWidth < el.scrollWidth - 4), { passive: true }); }); })();

/* ---------- Plattform-Feinschliff (aus der Prüfung für iPadOS, Windows, Firefox) ---------- */
(() => {
  // Safari löscht Speicher nach 7 Tagen ohne Besuch: um dauerhaften Speicher bitten.
  try { navigator.storage?.persist?.(); } catch { /* egal */ }
  // iPadOS kennt keinen Dateityp .sav und graut die Datei sonst aus: auf Touch-Geräten ohne Filter, Endung prüfen wir selbst.
  if (matchMedia('(pointer:coarse)').matches) $('#datei').removeAttribute('accept');
  // Bildschirmtastatur: Arbeitsplatz auf den sichtbaren Bereich zuschneiden, damit Eingabe und Konsole nicht dahinter liegen.
  const vv = window.visualViewport, ap = $('#arbeitsplatz'); if (!vv) return;
  const fit = () => {
    const t = document.body.classList.contains('tastatur');
    ap.style.top = t ? (vv.offsetTop + 56) + 'px' : '';
    ap.style.bottom = t ? Math.max(0, document.documentElement.clientHeight - vv.offsetTop - vv.height) + 'px' : '';
  };
  vv.addEventListener('resize', () => setTimeout(fit, 50)); vv.addEventListener('scroll', fit);
  document.addEventListener('focusout', () => setTimeout(fit, 350));
})();

/* ---------- Unter 1280 px: Journal als Überlagerung, mit Lasche zur Seite schieben oder ziehen ---------- */
(() => {
  const ap = $('#arbeitsplatz'), lasche = $('#ap-lasche');
  $('#ap-schleier').onclick = () => Arbeitsplatz.offen(false);
  let x0 = null, bewegt = false;
  lasche.addEventListener('pointerdown', e => { x0 = e.clientX; bewegt = false; lasche.setPointerCapture(e.pointerId); ap.style.transition = 'none'; });
  lasche.addEventListener('pointermove', e => { if (x0 === null) return; const d = Math.max(0, e.clientX - x0); if (d > 6) bewegt = true; ap.style.transform = `translateX(${d}px)`; });
  const los = e => {
    if (x0 === null) return; const d = e.clientX - x0; x0 = null; ap.style.transition = ''; ap.style.transform = '';
    if (!bewegt || d > 80) Arbeitsplatz.offen(false);
  };
  lasche.addEventListener('pointerup', los); lasche.addEventListener('pointercancel', () => { x0 = null; ap.style.transition = ''; ap.style.transform = ''; });
  lasche.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Arbeitsplatz.offen(false); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ap.hidden && matchMedia('(max-width:1279px)').matches && !e.target.closest('textarea, input') && $('#mehr').hidden) Arbeitsplatz.offen(false); });
})();


/* Sprung per #verstehen=<id> (etwa aus dem Fachbegriff-Fenster eines anderen Kapitels): Reiter „Verstehen“ öffnen und die Karte zeigen.
   verstehen.js (React-Bündel) lädt nach engine.js; deshalb erst nach „load“ und, falls nötig, kurz warten. */
(() => {
  const m = /^#verstehen=([A-Za-z0-9_-]+)$/.exec(location.hash);
  if (!m) return;
  const id = m[1];
  const los = () => {
    let n = 0;
    const versuch = () => {
      if (!window.Verstehen && n++ < 50) { setTimeout(versuch, 100); return; }
      tabWechsel('verstehen', id);
      history.replaceState(null, '', location.pathname + location.search);
    };
    versuch();
  };
  if (document.readyState === 'complete') los(); else addEventListener('load', los);
})();
