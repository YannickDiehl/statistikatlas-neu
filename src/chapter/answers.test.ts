import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerNumbers, judge, type Question } from './answers';

test('answerNumbers reads units and German/R formats', () => {
  assert.ok(answerNumbers('37 Personen').includes(37));
  assert.ok(answerNumbers('40 %').includes(40));
  assert.ok(answerNumbers('2.071').includes(2071));
  assert.ok(answerNumbers('65.000').includes(65));
  assert.ok(answerNumbers('4.529').includes(4529));
  const komma = answerNumbers('4,529');
  assert.ok(komma.includes(4.529));
  assert.ok(!komma.includes(4529));
  assert.deepEqual(answerNumbers(''), []);
  assert.deepEqual(answerNumbers('keine Ahnung'), []);
});

const num: Question = { id: 'a', label: 'n', kind: 'number', target: 5209, right: 'ok', hint: 'h' };
const choice: Question = { id: 'b', label: 'm', kind: 'choice', options: [{ value: 'MAIL', label: 'Mail' }, { value: 'CAPI', label: 'Capi' }], target: 'MAIL', right: 'ok', hint: 'h' };

test('judge numbers', () => {
  assert.equal(judge(num, '5.209'), 'right');
  assert.equal(judge(num, '5209'), 'right');
  assert.equal(judge(num, '5.164'), 'wrong');
  assert.equal(judge(num, ''), 'open');
  assert.equal(judge(num, undefined), 'open');
  assert.equal(judge(num, 'viele'), 'open');
});

test('judge choice', () => {
  assert.equal(judge(choice, 'MAIL'), 'right');
  assert.equal(judge(choice, 'CAPI'), 'wrong');
  assert.equal(judge(choice, undefined), 'open');
  assert.equal(judge(choice, ''), 'open');
});

test('number questions may accept a tolerance', () => {
  const q: Question = { id: 'v2', label: 'Anteil der 7', kind: 'number', target: 19.3, tolerance: 0.8, right: 'r', hint: 'h' };
  assert.equal(judge(q, '19,3'), 'right');
  assert.equal(judge(q, '19 %'), 'right');
  assert.equal(judge(q, '20.1'), 'right');
  assert.equal(judge(q, '20,2'), 'wrong');
  assert.equal(judge(q, '18,4'), 'wrong');
  const exact: Question = { id: 'x', label: 'x', kind: 'number', target: 37, right: 'r', hint: 'h' };
  assert.equal(judge(exact, '37,5'), 'wrong');
});

test('integer targets read R thousands commas, other targets keep the German decimal comma', () => {
  const big: Question = { id: 'n', label: 'n', kind: 'number', target: 5246, right: 'r', hint: 'h' };
  assert.equal(judge(big, '5,246'), 'right');
  assert.equal(judge(big, '5.246'), 'right');
  assert.equal(judge(big, '5,245'), 'wrong');
  const small: Question = { id: 'm', label: 'm', kind: 'number', target: 1656, right: 'r', hint: 'h' };
  assert.equal(judge(small, '1,656'), 'right');
  assert.equal(judge(small, '1,656 Personen'), 'right');
  assert.equal(judge({ ...small, target: 1656000 }, '1,656,000'), 'right');
  const dec: Question = { id: 'd', label: 'd', kind: 'number', target: 4529, tolerance: 0, right: 'r', hint: 'h' };
  assert.equal(judge({ ...dec, target: 4.529 }, '4,529'), 'right');
  assert.equal(judge({ ...dec, target: 4.529 }, '4529'), 'wrong');
  // A decimal comma with other than three digits stays a decimal comma.
  assert.equal(judge({ ...dec, target: 5 }, '5,2'), 'wrong');
  assert.equal(judge({ ...dec, target: 52 }, '5,2'), 'wrong');
});
