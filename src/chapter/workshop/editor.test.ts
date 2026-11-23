import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyKey, parseMarks, forBrowser, type Edit, type Key } from './editor';

const key = (k: string, m: Partial<Key> = {}): Key => ({ key: k, ctrl: false, meta: false, shift: false, alt: false, ...m });
/** '|' marks the cursor; '[' and ']' a selection. */
const edit = (s: string): Edit => {
  const a = s.indexOf('['), b = s.indexOf(']');
  if (a >= 0) return { text: s.replace('[', '').replace(']', ''), start: a, end: b - 1 };
  const c = s.indexOf('|');
  return { text: s.replace('|', ''), start: c, end: c };
};
const show = (e: Edit | null) => e && (e.start === e.end
  ? e.text.slice(0, e.start) + '|' + e.text.slice(e.start)
  : e.text.slice(0, e.start) + '[' + e.text.slice(e.start, e.end) + ']' + e.text.slice(e.end));
const press = (s: string, k: Key) => show(applyKey(edit(s), k));

test('pipe and assignment shortcuts', () => {
  for (const mod of [{ ctrl: true }, { meta: true }]) assert.equal(press('allbus|', key('M', { ...mod, shift: true })), 'allbus %>% |');
  assert.equal(press('x|', key('-', { alt: true })), 'x <- |');
  assert.equal(press('x|', key('–', { alt: true })), 'x <- |');
  assert.equal(press('|', key('-', { alt: true })), '<- |');
});

test('enter indents like RStudio', () => {
  assert.equal(press('allbus %>%|', key('Enter')), 'allbus %>%\n  |');
  assert.equal(press('  ggplot(aes(x = a)) +|', key('Enter')), '  ggplot(aes(x = a)) +\n  |');
  assert.equal(press('f(a,|', key('Enter')), 'f(a,\n  |');
  assert.equal(press('  ab(c,|', key('Enter')), '  ab(c,\n     |');
  assert.equal(press('  x|', key('Enter')), '  x\n  |');
  assert.equal(press('allbus %>%\n  frequency(hs01)|', key('Enter')), 'allbus %>%\n  frequency(hs01)\n|');
});

test('auto pairs', () => {
  assert.equal(press('|', key('(')), '(|)');
  assert.equal(press('|', key('"')), '"|"');
  assert.equal(press('(|)', key('Backspace')), '|');
  assert.equal(press('"|"', key('Backspace')), '|');
  assert.equal(press('f(|)', key(')')), 'f()|');
  assert.equal(press('[x]', key('(')), '([x])');
  assert.equal(press('a|b', key('Backspace')), null);
});

test('comment toggle', () => {
  const k = key('C', { ctrl: true, shift: true });
  assert.equal(press('[a\nb]', k), '[# a\n# b]');
  assert.equal(press('[# a\n# b]', k), '[a\nb]');
  assert.equal(press('[# a\nb]', k), '[# # a\n# b]');
  assert.equal(press('x|', k), '[# x]');
});

test('comment toggle ignores the next line when the selection ends at its start', () => {
  const k = key('C', { ctrl: true, shift: true });
  const e: Edit = { text: 'a\nb\nc', start: 0, end: 4 };
  assert.deepEqual(applyKey(e, k), { text: '# a\n# b\nc', start: 0, end: 7 });
});

test('keys left to the browser', () => {
  assert.equal(applyKey(edit('x|'), key('Enter', { ctrl: true })), null);
  assert.equal(applyKey(edit('x|'), key('Enter', { meta: true })), null);
  assert.equal(applyKey(edit('x|'), key('Tab')), null);
  assert.equal(applyKey(edit('x|'), key('Tab', { shift: true })), null);
  assert.equal(applyKey(edit('x|'), key('a')), null);
});

test('parseMarks', () => {
  const r = parseMarks('drop_na(⟦pa01⟧) %>%\n  ggplot(aes(x = ⟦pa01⟧))');
  assert.equal(r.code, 'drop_na(pa01) %>%\n  ggplot(aes(x = pa01))');
  assert.deepEqual(r.marks, [{ line: 0, from: 8, to: 12, word: 'pa01' }, { line: 1, from: 17, to: 21, word: 'pa01' }]);
  assert.deepEqual(parseMarks('a ⟦x⟧ ⟦yy⟧').marks.map(m => [m.from, m.to]), [[2, 3], [4, 6]]);
});

test('forBrowser', () => {
  const same = 'allbus %>%\n  frequency(hs01)';
  assert.equal(forBrowser(same), same);
  const start = '# Pakete laden und Daten einlesen\nlibrary(tidyverse)\nlibrary(mariposa)\n\nallbus <- read_spss("ZA8831_v1-3-0.sav")';
  const out = forBrowser(start);
  assert.ok(!/library|read_spss/.test(out));
  assert.ok(out.includes('# Pakete laden'));
});
