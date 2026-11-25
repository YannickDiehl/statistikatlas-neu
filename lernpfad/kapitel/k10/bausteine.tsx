// Kapitel 10: keine React-Bausteine in den Aufgaben, aber die Antwortprüfung des Kapitels.
// Die Fragen aus src/chapter/s10/content.ts haben Sonderfälle für Zahlen (`cases`, mit Toleranz) und einen Text je falscher
// Möglichkeit (`wrong`). PRUEFEN nimmt dafür die Prüfung des Kapitels (judge + wrongText aus s10/Check.tsx), damit keine Rückmeldung verloren geht.
import type { Baustein } from '../../react/typen';
import { judge, type Question } from '@atlas/chapter/answers';
import { wrongText } from '@atlas/chapter/s10/Check';
import type { S10Question } from '@atlas/chapter/s10/content';

export const BAUSTEINE: Record<string, Baustein> = {};

/** Antwortprüfung für alle Fragen der Seite: richtig → `right`, falsch → Sonderfall plus Hinweis bzw. Text der Möglichkeit. */
export function PRUEFEN(q: Question, input: string | undefined): { result: 'open' | 'right' | 'wrong'; text: string } {
  const text = (input ?? '').trim();
  const result = judge(q, text);
  if (result === 'right') return { result, text: q.right };
  if (result === 'wrong') return { result, text: wrongText(q as S10Question, text) };
  return { result, text: '' };
}
