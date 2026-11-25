/* RStudio-Kürzel, übernommen aus src/chapter/workshop/editor.ts (applyKey) des Atlas.
   Tab und Umschalt+Tab bleiben beim Browser, damit man Editoren per Tastatur verlassen kann. */
'use strict';
const Tasten = (() => {
  const replace = (e, text, back = 0) => { const pos = e.start + text.length - back; return { text: e.text.slice(0, e.start) + text + e.text.slice(e.end), start: pos, end: pos }; };
  const needsSpace = e => e.start > 0 && !/\s/.test(e.text[e.start - 1]);
  function indentAfter(text, lineStart, caret) {
    const line = text.slice(lineStart, caret); const open = [];
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { const j = line.indexOf('"', i + 1); if (j < 0) break; i = j; continue; }
      if (ch === '#') break;
      if (ch === '(') open.push(i);
      if (ch === ')') open.pop();
    }
    if (open.length) return ' '.repeat(open[open.length - 1] + 1);
    const base = line.match(/^ */)[0].length;
    const body = line.replace(/#.*$/, '').trimEnd();
    if (/(%>%|\+|\||&|,)$/.test(body)) return ' '.repeat(base === 0 ? 2 : base);
    const prevLine = lineStart > 0 ? text.slice(0, lineStart - 1).split('\n').pop() : '';
    if (base > 0 && /(%>%|\+)\s*$/.test(prevLine.replace(/#.*$/, ''))) return '';
    return ' '.repeat(base);
  }
  function applyKey(e, k) {
    const mod = k.ctrl || k.meta; const { text, start, end } = e; const lower = k.key.toLowerCase();
    if (mod && k.key === 'Enter') return null;
    if (k.key === 'Tab') return null;
    if (mod && k.shift && lower === 'm') return replace(e, (needsSpace(e) ? ' ' : '') + '%>% ');
    if (k.alt && !mod && (k.key === '-' || k.key === '–' || k.key === '−')) return replace(e, (needsSpace(e) ? ' ' : '') + '<- ');
    if (mod && k.shift && lower === 'c') {
      const s0 = text.lastIndexOf('\n', start - 1) + 1;
      const last = end > start && text[end - 1] === '\n' ? end - 1 : end;
      const nl = text.indexOf('\n', last); const e0 = nl < 0 ? text.length : nl;
      const block = text.slice(s0, e0).split('\n');
      const all = block.every(z => /^\s*#/.test(z) || !z.trim());
      const next = block.map(z => !z.trim() ? z : all ? z.replace(/^(\s*)# ?/, '$1') : z.replace(/^(\s*)/, '$1# ')).join('\n');
      return { text: text.slice(0, s0) + next + text.slice(e0), start: s0, end: s0 + next.length };
    }
    if (k.key === 'Enter' && !mod && !k.shift && !k.alt) {
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      return replace(e, '\n' + indentAfter(text, lineStart, start));
    }
    if (!mod && !k.alt) {
      const pair = k.key === '(' ? ')' : k.key === '"' ? '"' : null;
      if (pair) {
        if (start !== end) { const sel = text.slice(start, end); return { text: text.slice(0, start) + k.key + sel + pair + text.slice(end), start: start + 1, end: end + 1 }; }
        if (k.key === '"' && text[start] === '"') return { ...e, start: start + 1, end: start + 1 };
        // Wie RStudio: direkt vor oder hinter einem Wort kein Paar setzen (sonst wird aus nachbar ein ""nachbar).
        if (/[\w.]/.test(text[start] || '') || (k.key === '"' && /[\w.]/.test(text[start - 1] || ''))) return null;
        return replace(e, k.key + pair, 1);
      }
      if (start === end && k.key === ')' && text[start] === ')') return { ...e, start: start + 1, end: start + 1 };
      if (start === end && k.key === 'Backspace' && start > 0 && ((text[start - 1] === '(' && text[start] === ')') || (text[start - 1] === '"' && text[start] === '"')))
        return { text: text.slice(0, start - 1) + text.slice(start + 1), start: start - 1, end: start - 1 };
    }
    return null;
  }
  /** Ist der Ausdruck in der Konsole fertig? Offene Klammern, Anführungszeichen oder %>%/+ am Ende heißen: weiter tippen. */
  function fertig(code) {
    let tiefe = 0, inStr = false;
    for (const ch of code.replace(/#.*$/gm, '')) { if (ch === '"') inStr = !inStr; else if (!inStr) { if (ch === '(') tiefe++; if (ch === ')') tiefe--; } }
    return tiefe <= 0 && !inStr && !/(%>%|\+|,|\||&|<-)\s*$/.test(code.replace(/#.*$/gm, '').trimEnd());
  }
  function put(ta, n) { ta.value = n.text; ta.setSelectionRange(n.start, n.end); ta.dispatchEvent(new Event('input', { bubbles: true })); }
  /** Hängt die Kürzel an ein Textfeld. `ausfuehren` läuft bei Strg/Cmd+Enter. */
  function an(ta, ausfuehren, { konsole = false } = {}) {
    if (typeof AC !== "undefined") AC.an(ta);
    ['focus', 'pointerdown', 'input'].forEach(t => ta.addEventListener(t, () => { Tasten.aktiv = ta; }));
    ta.addEventListener('keydown', ev => {
      Tasten.aktiv = ta;
      if (ev.isComposing) return;
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); ausfuehren(); return; }
      if (konsole && ev.key === 'Enter' && !ev.shiftKey && !ev.altKey && fertig(ta.value)) { ev.preventDefault(); ausfuehren(); return; }
      const key = ev.altKey && ev.code === 'Minus' ? '-' : ev.key;
      const n = applyKey({ text: ta.value, start: ta.selectionStart, end: ta.selectionEnd }, { key, ctrl: ev.ctrlKey, meta: ev.metaKey, shift: ev.shiftKey, alt: ev.altKey });
      if (n) { ev.preventDefault(); put(ta, n); }
    });
  }
  /** Knopf der Einfüge-Leiste: wirkt im zuletzt benutzten Textfeld. */
  function einfuegen(text, back = 0) {
    const ta = Tasten.aktiv; if (!ta || !document.body.contains(ta)) return false;
    ta.focus(); const a = ta.selectionStart, b = ta.selectionEnd;
    const cut = text.startsWith(' ') && (a === 0 || /\s/.test(ta.value[a - 1])) ? text.slice(1) : text;
    put(ta, { text: ta.value.slice(0, a) + cut + ta.value.slice(b), start: a + cut.length - back, end: a + cut.length - back });
    return true;
  }
  function kommentar() {
    const ta = Tasten.aktiv; if (!ta || !document.body.contains(ta)) return;
    ta.focus(); const n = applyKey({ text: ta.value, start: ta.selectionStart, end: ta.selectionEnd }, { key: 'c', ctrl: true, meta: false, shift: true, alt: false }); if (n) put(ta, n);
  }
  function enter() {
    const ta = Tasten.aktiv; if (!ta || !document.body.contains(ta)) return;
    ta.focus(); const n = applyKey({ text: ta.value, start: ta.selectionStart, end: ta.selectionEnd }, { key: 'Enter', ctrl: false, meta: false, shift: false, alt: false }); if (n) put(ta, n);
  }
  /** Einfüge-Leiste als HTML; Knöpfe nehmen den Fokus nicht weg (pointerdown). */
  const leiste = label => `<div class="einfuegen" role="group" aria-label="${label}">
    <button type="button" data-ins=" %>% " title="Pipe: Strg/Cmd+Umschalt+M">%&gt;%</button>
    <button type="button" data-ins=" <- " title="Zuweisung: Alt+Minus">&lt;-</button>
    <button type="button" data-ins="()" data-back="1">( )</button>
    <button type="button" data-ins='""' data-back="1">" "</button>
    <button type="button" data-ins=" + ">+</button>
    <button type="button" data-ins=" == ">==</button>
    <button type="button" data-ins="⏎" title="Neue Zeile mit Einzug">⏎ Zeile</button>
    <button type="button" data-ins="#" title="Kommentar an/aus: Strg/Cmd+Umschalt+C"># an/aus</button>
    <button type="button" data-ins="⇥" title="Vorschläge: Tab">⇥ Vorschläge</button>
  </div>`;
  document.addEventListener('pointerdown', e => { if (e.target.closest('.einfuegen button')) e.preventDefault(); });
  document.addEventListener('click', e => {
    const b = e.target.closest('.einfuegen button'); if (!b) return;
    const ins = b.dataset.ins;
    if (ins === '#') kommentar(); else if (ins === '⏎') enter(); else if (ins === '⇥') { const ta = Tasten.aktiv; if (ta && document.body.contains(ta)) { ta.focus(); AC.zeigen(ta, true); } } else einfuegen(ins, +(b.dataset.back || 0));
  });
  return { an, leiste, aktiv: null, applyKey, fertig };
})();
