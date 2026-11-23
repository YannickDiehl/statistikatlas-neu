import type { ReactNode } from 'react';

/** Antwort in Sätzen: ganze Frage als Beschriftung, Hilfezeile, mehrzeiliges Feld in voller Breite.
 *  `example` steht grau im leeren Feld und zeigt, wie eine Antwort aussehen kann (Beispielsatz oder Satzanfang).
 *  `size`: 'short' für einen Halbsatz oder Satz (2 Zeilen), 'long' für zwei bis drei Sätze (4 Zeilen). Das Feld wächst beim Schreiben mit. */
export function TextAnswer({ id, label, help, example, value, onChange, size = 'short', maxLength, className }: {
  id?: string; label: ReactNode; help?: ReactNode; example?: string; value: string; onChange: (value: string) => void;
  size?: 'short' | 'long'; maxLength?: number; className?: string;
}) {
  return <label className={`task-text${className ? ` ${className}` : ''}`} htmlFor={id}>
    <span>{label}</span>
    {help && <small className="task-field-help">{help}</small>}
    <textarea id={id} rows={size === 'long' ? 4 : 2} className={`task-text-${size}`} maxLength={maxLength} value={value}
      placeholder={example} onChange={e => onChange(e.target.value)} />
  </label>;
}
