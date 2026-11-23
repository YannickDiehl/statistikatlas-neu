import { record, str } from '../tasks/kit/storage';
import { judge, type Question } from './answers';

export const chapterStorageKey = 'statistikatlas.kapitel.v1';
export type ChapterState = { predictions: Record<string, string>; answers: Record<string, string> };

const strings = (x: unknown): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(record(x))) if (typeof v === 'string') out[k] = str(v, 200);
  return out;
};

export function parseChapterStore(raw: string | null): Record<number, ChapterState> {
  if (!raw) return {};
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return {}; }
  const out: Record<number, ChapterState> = {};
  for (const [id, value] of Object.entries(record(record(data).chapters))) {
    if (!/^\d+$/.test(id) || !value || typeof value !== 'object' || Array.isArray(value)) continue;
    const v = record(value);
    out[Number(id)] = { predictions: strings(v.predictions), answers: strings(v.answers) };
  }
  return out;
}

export function chapterStatus(state: ChapterState, required: Question[]): 'open' | 'running' | 'done' {
  if (required.length && required.every(q => judge(q, state.answers[q.id]) === 'right')) return 'done';
  const any = Object.values(state.answers).some(a => a.trim() !== '');
  return any ? 'running' : 'open';
}
