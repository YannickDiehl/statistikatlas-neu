// Ersatz für src/chapter/workshop/CodeWorkshop.tsx im Lernpfad: Code nur zum Lesen (mit Kopieren), ausgeführt wird im Lernjournal.
import { useState } from 'react';

export function CodeWorkshop({ title, template }: { id?: string; title: string; template: string; live?: boolean; tryOut?: boolean }) {
  const teile = template.split(/⟦([^⟧]*)⟧/);
  const roh = teile.join('');
  const [kopiert, setKopiert] = useState(false);
  // Farbig wie im Journal (RFarbe aus tasten.js); gelbe Stellen als Bereiche im Rohtext.
  const ranges: { from: number; to: number }[] = []; let pos = 0;
  teile.forEach((t, i) => { if (i % 2) ranges.push({ from: pos, to: pos + t.length }); pos += t.length; });
  const farbe = (window as unknown as { RFarbe?: { html(c: string, r: { from: number; to: number }[]): string } }).RFarbe;
  return <div className="v-vorlage"><div className="cb">
    <div className="cb-kopf"><span className="cb-titel">{title}</span><span className="cb-notiz">zum Lesen</span>
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(roh); setKopiert(true); setTimeout(() => setKopiert(false), 1500); } catch { /* egal */ } }}>{kopiert ? 'Kopiert ✓' : 'Kopieren'}</button></div>
    {farbe
      ? <pre aria-label={title} data-r="1" dangerouslySetInnerHTML={{ __html: farbe.html(roh, ranges) }} />
      : <pre aria-label={title}>{teile.map((t, i) => i % 2 ? <mark key={i}>{t}</mark> : t)}</pre>}
  </div></div>;
}
