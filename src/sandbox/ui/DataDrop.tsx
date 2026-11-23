import { ExternalLink, Upload } from 'lucide-react';
import { useId, useState } from 'react';
import { allbusSource, validateAllbus } from '../allbus';
import { saveStoredAllbus } from '../allbusStore';
import { readSav, SavError, type SavFile } from '../readSav';

export type LoadedData = { sav: SavFile; fileName: string; version: string; bytes: ArrayBuffer };

export async function loadAllbusFile(file: { name: string; arrayBuffer: () => Promise<ArrayBuffer> }): Promise<LoadedData> {
  if (!/\.sav$/i.test(file.name)) throw new SavError('Bitte eine SPSS-Datei mit der Endung .sav wählen.');
  const bytes = await file.arrayBuffer();
  const sav = readSav(bytes);
  const check = validateAllbus(sav);
  if (!check.ok) throw new SavError(check.message);
  return { sav, fileName: file.name, version: check.version, bytes };
}

export function DataDrop({ onLoaded, onStored, landmark = true }: { onLoaded: (data: LoadedData) => void; onStored?: (ok: boolean) => void; /** false: a plain div instead of a named region (many drop zones on one page). */ landmark?: boolean }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  /** Unique per drop zone: a chapter shows one in every workshop until a file is loaded. */
  const titleId = `sandbox-drop-title-${useId().replace(/[^\w-]/g, '')}`;

  async function take(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const loaded = await loadAllbusFile(file);
      onLoaded(loaded);
      onStored?.(await saveStoredAllbus({ name: loaded.fileName, bytes: loaded.bytes }));
    } catch (e) {
      setError(e instanceof SavError ? e.message : 'Die Datei konnte nicht gelesen werden.');
    } finally {
      setBusy(false);
    }
  }

  const Wrap = landmark ? 'section' : 'div';
  return <Wrap className="sandbox-drop-wrap" {...(landmark ? { 'aria-labelledby': titleId } : {})}>
    <label
      className={`sandbox-drop${over ? ' over' : ''}`}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); void take(e.dataTransfer.files[0]); }}
    >
      <Upload size={28} aria-hidden="true" />
      <strong id={titleId}>{busy ? 'Datei wird gelesen …' : 'ALLBUS-Datei hierher ziehen oder auswählen'}</strong>
      <span>ZA8831_v1-3-0.sav, bleibt auf deinem Rechner</span>
      <input type="file" accept=".sav" onChange={e => void take(e.target.files?.[0])} />
    </label>
    {/* Present from the start, so the reading note is announced; the visible title above is not a live region. */}
    <span className="sr-only" aria-live="polite">{busy ? 'Datei wird gelesen …' : ''}</span>
    {error && <p className="sandbox-error" role="alert">{error}</p>}
    <p className="sandbox-note">
      Noch keine Datei? Den ALLBUScompact 2023 (ZA8831) gibt es nach kostenloser Registrierung bei{' '}
      <a href={allbusSource} target="_blank" rel="noreferrer">GESIS <ExternalLink size={13} aria-hidden="true" /></a>.
      Die Datei bleibt in deinem Browser gespeichert, bis du sie entfernst. Hochgeladen wird nichts.
    </p>
  </Wrap>;
}
