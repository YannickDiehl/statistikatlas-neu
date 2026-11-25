// Kapitel 3: Bausteine in den Aufgaben und die eigene Antwortprüfung.
// PRUEFEN nutzt die Prüfung des Atlas (judge) und die Hinweise des Kapitels (hintFor aus content.ts):
// eigene Rückmeldung je typischer falscher Zahl (special, mit Toleranz) und je falscher Option (wrongBy).
import type { Baustein } from '../../react/typen';
import { judge, type Question } from '@atlas/chapter/answers';
import { hintFor, type TaskQuestion } from '@atlas/chapter/s03/content';
import { OneNumeratorThreeBases } from '@atlas/chapter/s03/figures/Stones';

export const BAUSTEINE: Record<string, Baustein> = {
  /** Aufgabe 2, Schritt 4: ein Zähler, drei Nenner (statisch, ohne Ergebnisse), wie im Atlas in diesem Schritt. */
  DreiBasen: () => <OneNumeratorThreeBases />,
};

export function PRUEFEN(q: Question, input: string | undefined): { result: 'open' | 'right' | 'wrong'; text: string } {
  const result = judge(q, input);
  if (result === 'right') return { result, text: q.right };
  if (result === 'open') return { result, text: '' };
  return { result, text: hintFor(q as TaskQuestion, input) };
}
