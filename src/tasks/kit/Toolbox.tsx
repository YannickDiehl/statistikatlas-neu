import type { ReactNode } from 'react';
import { RBlock } from './RBlock';

/** Ein Werkzeug der Sitzung: Funktion, ein Satz Erklärung, Kennzeichen „neu“ oder „kennst du schon“. */
export type Tool = { fn: string; text: ReactNode; isNew?: boolean };

/** Werkzeugkasten am Anfang einer Sitzung: alle Funktionen, die man braucht, mit Beispielen an anderen Variablen als in den Aufgaben.
 *  Die Aufgaben selbst zeigen keinen fertigen Code – übertragen müssen die Studierenden selbst. */
export function Toolbox({ tools, code, file }: { tools: Tool[]; code: string; file?: string }) {
  return <section className="task-toolbox" aria-label="Werkzeugkasten">
    <span className="learning-eyebrow">DEIN WERKZEUGKASTEN</span>
    <p className="task-toolbox-intro">Diese Werkzeuge brauchst du heute. Die Beispiele laufen bewusst an anderen Variablen als die Aufgaben: Probier sie aus – auf deine Aufgaben übertragen musst du sie selbst.</p>
    <ul className="task-toolbox-list">
      {tools.map(t => <li key={t.fn}><code>{t.fn}</code>{t.isNew && <span className="task-toolbox-new">neu</span>} {t.text}</li>)}
    </ul>
    <RBlock code={code} file={file} />
  </section>;
}
