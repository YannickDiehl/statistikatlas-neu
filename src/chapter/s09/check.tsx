// Sitzung 9: Rückmeldung mit Sonderfällen und Text mit **fett** und `Code`. Lokal, weil der gemeinsame
// Baustein `Questions` nur eine Rückmeldung je Frage kennt (der Plan nennt je Frage Sonderfälle).
import type { ReactNode } from 'react';
import { answerNumbers, judge } from '../answers';
import type { S9Question } from './content';

export type Feedback = { result: 'open' | 'right' | 'wrong'; text: string };

/**
 * Rückmeldung für eine Antwort: richtig → `right`; falsch → der Sonderfall der Zahl (in der Reihenfolge der Lesarten,
 * R-Schreibweise zuerst) oder der falschen Option, sonst `hint`.
 */
export function feedbackFor(q: S9Question, input: string | undefined): Feedback {
  const result = judge(q, input);
  if (result === 'open') return { result, text: '' };
  if (result === 'right') return { result, text: q.right };
  const text = (input ?? '').trim();
  if (q.kind === 'choice') return { result, text: q.wrong?.[text] ?? q.hint };
  const tol = q.tolerance ?? 0;
  for (const x of answerNumbers(text)) {
    const hit = q.special?.find(s => s.at.some(v => Math.abs(x - v) <= (s.tolerance ?? tol) + 1e-9));
    if (hit) return { result, text: hit.text };
  }
  return { result, text: q.hint };
}

/** Renders `code` and **bold** segments of a text. */
export function rich(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/);
  if (parts.length === 1) return text;
  return parts.map((p, i) => p.startsWith('`') && p.endsWith('`') && p.length > 1 ? <code key={i}>{p.slice(1, -1)}</code>
    : p.startsWith('**') && p.endsWith('**') && p.length > 4 ? <b key={i}>{p.slice(2, -2)}</b> : p);
}

/** Plain text without the markup (for aria-labels and tests). */
export const plain = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
