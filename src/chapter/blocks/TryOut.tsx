import type { ReactNode } from 'react';

/** Closed „Weiterdenken“ box with a try-out workshop; explicitly not needed for the task. */
export function TryOut({ idea, workshop }: { idea: ReactNode; workshop: ReactNode }) {
  return <details className="probier">
    <summary>Weiterdenken in der Probier-Werkstatt <small>(für die Aufgabe nicht nötig)</small></summary>
    <p>Für die Aufgabe reichen die Vorlagen oben. Hier ist Platz für eigene Fragen. Eine Idee: {idea} Die Probier-Werkstatt startet mit einem Vorschlag.</p>
    {workshop}
  </details>;
}
