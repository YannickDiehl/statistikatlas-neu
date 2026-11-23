// Antwortprüfung für Sitzung 5: wie `judge` aus answers.ts, dazu „ganze Zahl ±0,55“, „2,630“ als Tausender und Rückmeldungen je falschem Wert.
import { answerNumbers, judge } from '../answers';
import type { ChapterState } from '../state';
import type { Q5 } from './content';

/** Die erste Zahl der Eingabe, wenn sie ganz ohne Komma oder Punkt geschrieben ist („7“, „34 %“), sonst null. */
export function wholeNumber(input: string): number | null {
  const token = input.replace(/[−–]/g, '-').match(/-?\d[\d.,]*/)?.[0]?.replace(/[.,]+$/, '');
  return token && /^-?\d+$/.test(token) ? Number(token) : null;
}

/** Alle Lesarten der Eingabe; dazu „2,630“ als 2630 (R schreibt Tausender mit Komma). */
function readings(input: string): number[] {
  const xs = answerNumbers(input);
  const token = input.match(/\d[\d.,]*/)?.[0]?.replace(/[.,]+$/, '');
  return token && /^\d{1,3}(,\d{3})+$/.test(token) ? [...xs, Number(token.replace(/,/g, ''))] : xs;
}

/** Liegt die Eingabe bei `value`? Toleranz der Frage; bei `whole` und ganzer Zahl ±0,55. */
export function near(q: Q5, input: string, value: number): boolean {
  if (q.kind !== 'number') return false;
  const xs = readings(input);
  if (xs.some(x => Math.abs(x - value) <= (q.tolerance ?? 0) + 1e-9)) return true;
  const w = q.whole ? wholeNumber(input) : null;
  return w !== null && Math.abs(w - value) <= 0.55 + 1e-9;
}

/** open, right oder wrong; schließt alles ein, was `judge` richtig findet. */
export function judge5(q: Q5, input: string | undefined): 'open' | 'right' | 'wrong' {
  const text = (input ?? '').trim();
  if (q.kind === 'choice' || !text) return judge(q, text);
  if (!readings(text).length) return 'open';
  return near(q, text, q.target) ? 'right' : 'wrong';
}

/** Rückmeldung bei falscher Antwort: der Text zum typischen Wert, sonst der allgemeine Hinweis. */
export function wrongText(q: Q5, input: string): string {
  const text = input.trim();
  if (q.wrong) {
    if (q.kind === 'choice' && q.wrong[text]) return q.wrong[text];
    if (q.kind === 'number') {
      const hit = Object.keys(q.wrong).find(k => near(q, text, Number(k)));
      if (hit) return q.wrong[hit];
    }
  }
  return q.hint;
}

/**
 * Zustand für `chapterStatus`: Antworten, die erst mit der Regel „ganze Zahl ±0,55“ richtig sind,
 * stehen dort mit dem Zielwert, damit Seitenleiste und Rückmeldung dasselbe sagen.
 */
export function withWholeNumbers(state: ChapterState, questions: Q5[]): ChapterState {
  const answers = { ...state.answers };
  for (const q of questions) {
    if (q.kind !== 'number') continue;
    const a = answers[q.id];
    if (a !== undefined && judge(q, a) !== 'right' && judge5(q, a) === 'right') answers[q.id] = String(q.target);
  }
  return { ...state, answers };
}

/** The resolution of a prediction („Tatsächlich …“) appears only once no question of the task is open. */
export function resolutionVisible(questions: Q5[], answers: Record<string, string> | null): boolean {
  return !!answers && questions.every(q => judge5(q, answers[q.id]) !== 'open');
}
