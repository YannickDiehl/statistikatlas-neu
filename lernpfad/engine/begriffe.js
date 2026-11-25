/* Fachbegriffe in der Lernpfad-Engine: Marken ⟪Text|id⟫ (oder ⟪Name⟫) in Texten werden zu antippbaren Knöpfen,
   ein Popover erklärt den Begriff (Verzeichnis: window.BEGRIFFE aus lernpfad/begriffe.json).
   Wird vor engine.js geladen; ein MutationObserver markiert alles, was die Engine später per innerHTML einsetzt.
   Die Knöpfe aus dem React-Bündel (<Begriff>, class="begriff" data-b) öffnen dasselbe Popover. */
'use strict';
(() => {
// Muss gleich MARKE in src/lib/begriffe.ts sein (geprüft in src/lib/lernpfad-begriffe.test.ts).
// ⟦…⟧ sind Lücken der Code-Werkstatt (engine.js marken()) und werden hier nie angefasst.
const MARKE = /⟪([^⟪⟫|\n]+)(?:\|([a-z0-9-]+))?⟫/g;

const verzeichnis = () => window.BEGRIFFE || {};
const ohneMarken = s => String(s).replace(MARKE, (_m, text) => text);

/** Wie aufloesen() in src/lib/begriffe.ts: erst id, sonst exakter Name oder Alias (ohne Groß-/Kleinschreibung). */
function aufloesen(text, id, vz) {
  if (id) return Object.hasOwn(vz, id) ? id : null;
  const t = text.trim().toLowerCase();
  for (const [key, e] of Object.entries(vz)) {
    if (e.name.toLowerCase() === t || (e.alias || []).some(a => a.toLowerCase() === t)) return key;
  }
  return null;
}

// Unbekannte Marken: einmal je Marke warnen (der MutationObserver ruft zerlege() oft auf).
const gewarnt = new Set();
function warnen(marke) {
  if (gewarnt.has(marke)) return;
  gewarnt.add(marke);
  if (typeof console !== 'undefined') console.warn(`Fachbegriff unbekannt: ${marke} steht im Verzeichnis (lernpfad/begriffe.json) nicht und wird als bloßer Text gezeigt.`);
}

/** Zerlegt einen Text in Stücke: Text bleibt Text, bekannte Marken werden zu { text, id }, unbekannte zu bloßem Text. */
function zerlege(text) {
  const s = String(text), vz = verzeichnis(), teile = [];
  const textDazu = t => {
    if (!t) return;
    if (typeof teile[teile.length - 1] === 'string') teile[teile.length - 1] += t; else teile.push(t);
  };
  let zuletzt = 0;
  for (const m of s.matchAll(MARKE)) {
    textDazu(s.slice(zuletzt, m.index));
    const id = aufloesen(m[1], m[2], vz);
    if (id) teile.push({ text: m[1], id }); else { warnen(m[0]); textDazu(m[1]); }
    zuletzt = m.index + m[0].length;
  }
  textDazu(s.slice(zuletzt));
  return teile;
}

/** Ziel der Karte in „Verstehen“: karte ist "<id>" (Kapitel des Begriffs) oder "kNN:<id>"; sonst null. */
function karteZiel(e) {
  if (!e || typeof e.karte !== 'string' || !e.karte) return null;
  const m = /^(?:k(\d{1,2}):)?([A-Za-z0-9_-]+)$/.exec(e.karte);
  if (!m) return null;
  const kapitel = m[1] ? Number(m[1]) : e.kapitel;
  return Number.isInteger(kapitel) ? { kapitel, id: m[2] } : null;
}

/** Text ohne Marken (⟪Text|id⟫ → Text), für Daten, die ins Journal oder in den Export kopiert werden. */
const ohne = text => ohneMarken(text);

const api = { zerlege, ohne, karteZiel, markieren() {}, oeffnen() {}, schliessen() {} };
window.Begriffe = api;
if (typeof document === 'undefined') return; // Test in node:vm: nur zerlege()

/* ---------- Marken im DOM ersetzen ---------- */
// Hier keine Knöpfe: Code, Eingaben, Grafiken, schon gesetzte Begriffe, React-Wurzeln (Verstehen, Mitnehmen, Bilder, Bausteine), das Popover selbst.
const AUSSER = 'code, pre, textarea, script, style, svg, .begriff, #p-verstehen, #p-mitnehmen, .d-react, .baustein-wurzel, #begriff-pop';
// In Links und Knöpfen darf kein Knopf stehen: Dort wird die Marke zu bloßem Text.
const NUR_TEXT = 'a, button, option, select';
const ATTRIBUTE = ['aria-label', 'title', 'alt', 'placeholder'];
const KEIN_TEXT = 'code, pre, textarea, script, style, svg';
const ATTR_SEL = ATTRIBUTE.map(a => `[${a}*="⟪"]`).join(',');

function knopf(teil) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'begriff'; b.dataset.b = teil.id;
  b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-expanded', 'false');
  b.textContent = teil.text;
  return b;
}

function textknoten(n) {
  const el = n.parentElement;
  if (!el || el.closest(AUSSER)) return;
  const teile = zerlege(n.nodeValue);
  if (teile.length === 1 && teile[0] === n.nodeValue) return;
  if (el.closest(NUR_TEXT)) { n.nodeValue = ohneMarken(n.nodeValue); return; }
  const frag = document.createDocumentFragment();
  for (const t of teile) frag.append(typeof t === 'string' ? document.createTextNode(t) : knopf(t));
  n.replaceWith(frag);
}

function attribute(el) {
  for (const a of ATTRIBUTE) {
    const v = el.getAttribute(a);
    if (v && v.includes('⟪')) el.setAttribute(a, ohneMarken(v));
  }
}

/** Ersetzt Marken in allen Textknoten unter root (außerhalb AUSSER) und macht Marken in Attributen zu bloßem Text. */
function markieren(root) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) { if (root.nodeValue.includes('⟪')) textknoten(root); return; }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
  if (root.nodeType === Node.ELEMENT_NODE && root.closest(KEIN_TEXT)) return;
  if (root.nodeType === Node.ELEMENT_NODE) {
    attribute(root);
    // Knöpfe aus dem React-Bündel: nur die Popup-Hinweise ergänzen (Text bleibt unberührt).
    if (root.matches('.begriff[data-b]:not([aria-haspopup])')) { root.setAttribute('aria-haspopup', 'dialog'); root.setAttribute('aria-expanded', 'false'); }
  }
  root.querySelectorAll(ATTR_SEL).forEach(attribute);
  root.querySelectorAll('.begriff[data-b]:not([aria-haspopup])').forEach(b => { b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-expanded', 'false'); });
  if (!root.textContent.includes('⟪') || root.closest?.(AUSSER)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.nodeValue.includes('⟪') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  const liste = [];
  while (w.nextNode()) liste.push(w.currentNode);
  liste.forEach(textknoten);
}

new MutationObserver(records => {
  for (const r of records) {
    if (r.type === 'childList') r.addedNodes.forEach(markieren);
    else if (r.type === 'characterData') markieren(r.target);
    else if (r.type === 'attributes') attribute(r.target);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTE });
markieren(document.body);

/* ---------- Popover ---------- */
const pop = document.createElement('div');
pop.id = 'begriff-pop'; pop.className = 'begriff-pop'; pop.hidden = true; pop.tabIndex = -1;
pop.setAttribute('role', 'dialog');
document.body.append(pop);
let aktiv = null;

const absatz = (label, text) => {
  const p = document.createElement('p'); const b = document.createElement('b');
  b.textContent = label + ' '; p.append(b, text); return p;
};
const kapitelOrdner = nr => 'k' + String(nr).padStart(2, '0');

function lage() {
  if (!aktiv || pop.hidden) return;
  const vw = document.documentElement.clientWidth, vh = window.innerHeight, rand = 10, abstand = 6;
  pop.style.maxHeight = (vh - 2 * rand) + 'px';
  const r = aktiv.isConnected ? aktiv.getBoundingClientRect() : null;
  const w = pop.offsetWidth, h = pop.offsetHeight;
  let links = r ? r.left : (vw - w) / 2, oben;
  links = Math.max(rand, Math.min(links, vw - w - rand));
  if (!r) oben = (vh - h) / 2;
  else if (r.bottom + abstand + h <= vh - rand) oben = r.bottom + abstand;
  else if (r.top - abstand - h >= rand) oben = r.top - abstand - h;
  else oben = vh - h - rand;
  pop.style.left = Math.round(links) + 'px';
  pop.style.top = Math.round(Math.max(rand, oben)) + 'px';
}

function oeffnen(k) {
  const id = k?.dataset?.b, e = id && Object.hasOwn(verzeichnis(), id) ? verzeichnis()[id] : null;
  if (!e) return;
  if (aktiv && aktiv !== k) aktiv.setAttribute('aria-expanded', 'false');
  aktiv = k; k.setAttribute('aria-expanded', 'true');
  pop.replaceChildren();
  pop.setAttribute('aria-label', e.name);
  const kopf = document.createElement('div'); kopf.className = 'bp-kopf';
  const name = document.createElement('p'); name.className = 'bp-name'; name.append(Object.assign(document.createElement('b'), { textContent: e.name }));
  const zu = document.createElement('button'); zu.type = 'button'; zu.className = 'bp-zu'; zu.setAttribute('aria-label', 'Schließen'); zu.textContent = '✕';
  zu.onclick = () => schliessen();
  kopf.append(name, zu); pop.append(kopf);
  const abs = [absatz('In der Fachsprache:', e.fach), absatz('Kurz gesagt:', e.kurz)];
  if (e.bild?.length) abs.push(absatz('Im Bild:', e.bild[0]));
  abs.forEach((p, i) => { p.id = 'bp-abs-' + i; });
  pop.append(...abs);
  pop.setAttribute('aria-describedby', abs.map(p => p.id).join(' '));
  const meta = window.KMETA || {};
  const ziel = karteZiel(e);
  const zielKapitel = ziel ? ziel.kapitel : e.kapitel;
  const gleich = zielKapitel === meta.nr;
  const ordner = kapitelOrdner(zielKapitel);
  // Anderes Kapitel: nur verlinken, wenn es das Kapitel schon gibt (die linke Leiste verlinkt nur gebaute Kapitel).
  const fremdDa = !gleich && document.querySelector(`#sitzungen a[href="../${ordner}/"]`);
  if (ziel && (gleich || fremdDa)) {
    const a = document.createElement('a'); a.className = 'bp-mehr'; a.textContent = 'Mehr in Verstehen →';
    if (gleich) {
      a.href = '#p-verstehen';
      a.onclick = ev => { ev.preventDefault(); schliessen(false); if (typeof tabWechsel === 'function') tabWechsel('verstehen', ziel?.id); };
    } else {
      a.href = `../${ordner}/${ziel ? '#verstehen=' + ziel.id : ''}`; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', `Mehr in Verstehen, Sitzung ${zielKapitel} (neuer Tab)`);
    }
    pop.append(a);
  }
  pop.hidden = false; lage();
  pop.focus({ preventScroll: true });
}

/** Schließt das Popover; mit fokus (Standard) geht der Fokus zurück an den Begriff. */
function schliessen(fokus = true) {
  if (pop.hidden) return;
  pop.hidden = true;
  const k = aktiv; aktiv = null;
  if (!k) return;
  k.setAttribute('aria-expanded', 'false');
  if (fokus && k.isConnected) k.focus({ preventScroll: true });
}

Object.assign(api, { markieren, oeffnen, schliessen });

document.addEventListener('click', ev => {
  const k = ev.target.closest?.('.begriff[data-b]');
  if (!k) return;
  ev.preventDefault(); // etwa in <summary>: nicht auf- oder zuklappen
  if (k === aktiv && !pop.hidden) schliessen(); else oeffnen(k);
});
// Klick außerhalb schließt. Landet der Klick auf etwas Bedienbarem, behält das den Fokus; sonst zurück an den Begriff.
document.addEventListener('pointerdown', ev => {
  if (pop.hidden || pop.contains(ev.target) || ev.target.closest?.('.begriff[data-b]') === aktiv) return;
  const bedienbar = ev.target.closest?.('a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]');
  schliessen(!bedienbar);
}, true);
// Esc: zuerst das Popover (Erfassungsphase, vor den Esc-Handlern der Engine für Leiste und Journal).
document.addEventListener('keydown', ev => {
  if (pop.hidden) return;
  if (ev.key === 'Escape') { ev.preventDefault(); ev.stopImmediatePropagation(); schliessen(); return; }
  if (ev.key === 'Tab' && pop.contains(document.activeElement)) {
    const f = [...pop.querySelectorAll('a[href], button')];
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    let n;
    if (ev.shiftKey) n = i <= 0 ? f[f.length - 1] : f[i - 1];
    else n = i === -1 || i === f.length - 1 ? f[0] : f[i + 1];
    ev.preventDefault(); n.focus();
  }
}, true);
window.addEventListener('resize', lage);
window.addEventListener('scroll', lage, true);
})();
