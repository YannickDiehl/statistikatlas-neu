import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseChapterStore, chapterStatus, chapterStorageKey } from './state';
import type { Question } from './answers';

test('parseChapterStore is defensive', () => {
  assert.equal(chapterStorageKey, 'statistikatlas.kapitel.v1');
  assert.deepEqual(parseChapterStore('{"chapters":{"4":{"answers":{"a1b":"37"},"x":1}}}'), { 4: { predictions: {}, answers: { a1b: '37' } } });
  assert.deepEqual(parseChapterStore('müll'), {});
  assert.deepEqual(parseChapterStore(null), {});
  assert.deepEqual(parseChapterStore('{"chapters":{"x":{},"5":[]}}'), {});
  const long = 'a'.repeat(500);
  assert.equal(parseChapterStore(JSON.stringify({ chapters: { 1: { predictions: { p: long } } } }))[1].predictions.p.length, 200);
});

const qs: Question[] = [
  { id: 'q1', label: '', kind: 'number', target: 37, right: '', hint: '' },
  { id: 'q2', label: '', kind: 'number', target: 40, right: '', hint: '' },
];
test('chapterStatus', () => {
  assert.equal(chapterStatus({ predictions: {}, answers: {} }, qs), 'open');
  assert.equal(chapterStatus({ predictions: {}, answers: { q1: '37' } }, qs), 'running');
  assert.equal(chapterStatus({ predictions: {}, answers: { q1: '37', q2: '40' } }, qs), 'done');
  assert.equal(chapterStatus({ predictions: {}, answers: { q1: '99' } }, qs), 'running');
});
