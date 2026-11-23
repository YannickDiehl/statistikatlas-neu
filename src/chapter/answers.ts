import { numberReadings } from '../tasks/kit/numbers';

type QuestionBase = {
  id: string;
  /** The question at the field; code in `backticks`. */
  label: string;
  /** Short name for the feedback line („Personen im NA-Balken“); falls back to `label`. */
  short?: string;
  /** Help line under the field (aria-describedby); code in `backticks`. */
  help?: string;
  right: string;
  hint: string;
};

export type Question =
  | QuestionBase & {
    kind: 'number'; target: number; /** Right if |reading − target| ≤ tolerance. */ tolerance?: number;
    /**
     * Exact (trimmed) input → feedback instead of `hint`, e.g. a typical wrong number. Also turns an unreadable input
     * („NA“) into a wrong one. Not called `special`: sessions 3 and 8 already use that name for their own array form.
     */
    specialInput?: Record<string, string>;
  }
  | QuestionBase & {
    kind: 'choice'; options: { value: string; label: string }[]; target: string;
    /** Wrong option value → feedback instead of `hint`. */
    wrongByOption?: Record<string, string>;
  };

/** Erste Zahl im Text („37 Personen“, „40 %“), mit allen Lesarten (deutsches Komma, Tausenderpunkt, R-Dezimalpunkt). */
export function answerNumbers(input: string): number[] {
  const token = numberToken(input);
  return token ? numberReadings(token).map(r => r.x) : [];
}

/** The first number-like token of the text, without trailing dots or commas. */
function numberToken(input: string): string | undefined {
  return input.replace(/[−–]/g, '-').match(/-?\d[\d.,]*/)?.[0].replace(/[.,]+$/, '');
}

/** R prints counts with a thousands comma („5,246“). Only read so where the answer is a whole number. */
const THOUSANDS_COMMA = /^-?\d{1,3}(,\d{3})+$/;

export function judge(q: Question, input: string | undefined): 'open' | 'right' | 'wrong' {
  const text = (input ?? '').trim();
  if (!text) return 'open';
  if (q.kind === 'choice') return text === q.target ? 'right' : 'wrong';
  const readings = answerNumbers(text);
  const token = numberToken(text);
  if (Number.isInteger(q.target) && token && THOUSANDS_COMMA.test(token)) readings.push(Number(token.replace(/,/g, '')));
  if (!readings.length) return 'open';
  const tol = q.tolerance ?? 0;
  return readings.some(x => Math.abs(x - q.target) <= tol + 1e-9) ? 'right' : 'wrong';
}

/** Own feedback for a wrong answer (`specialInput`, `wrongByOption`), if the question has one for this input. */
export function wrongFeedback(q: Question, input: string | undefined): string | undefined {
  const text = (input ?? '').trim();
  if (!text) return undefined;
  const map: unknown = q.kind === 'number' ? q.specialInput : q.wrongByOption;
  if (!map || typeof map !== 'object' || Array.isArray(map) || !Object.hasOwn(map, text)) return undefined;
  const own = (map as Record<string, unknown>)[text];
  return typeof own === 'string' ? own : undefined;
}

/** Like `judge`, but an input with its own wrong-answer feedback counts as wrong even where `judge` reads no number. */
export function judgeWithFeedback(q: Question, input: string | undefined): { result: 'open' | 'right' | 'wrong'; text: string } {
  const result = judge(q, input);
  if (result === 'right') return { result, text: q.right };
  const own = wrongFeedback(q, input);
  if (own !== undefined) return { result: 'wrong', text: own };
  return { result, text: result === 'wrong' ? q.hint : '' };
}
