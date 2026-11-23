import test from 'node:test';
import assert from 'node:assert/strict';
import { rStyleProblems } from '../kit/rStyle';
import { hints, ITEM_IDS, ITEMS, NONVOTE_EXTRAS, R_EXTRA, R_P1, R_P2, R_P3_EXAMPLE, R_SETUP, R_SOLUTION, TOOLBOX_SCRIPT } from './content';
import { rCodeFor, type Way } from './domain';

const subsets = <T,>(xs: readonly T[]): T[][] => xs.reduce<T[][]>((acc, x) => [...acc, ...acc.map(s => [...s, x])], [[]]);

test('every R code block of session 5 follows the uniform layout (Schriftbild)', () => {
  const blocks: [string, string][] = [
    ['R_SETUP', R_SETUP], ['TOOLBOX_SCRIPT', TOOLBOX_SCRIPT], ['R_P1', R_P1], ['R_P2', R_P2], ['R_P3_EXAMPLE', R_P3_EXAMPLE],
    ['R_EXTRA', R_EXTRA], ['R_SOLUTION', R_SOLUTION],
    ...Object.entries(hints).flatMap(([k, h]): [string, string][] => [[`${k}.scaffold`, h.scaffold], [`${k}.solution`, h.solution]]),
  ];
  // Jede Lesart, die man in Prüfauftrag 3 zusammenklicken kann.
  for (const item of ITEM_IDS) for (const distrust of subsets(ITEMS[item].categories.map(c => c.code))) {
    for (const nonvote of subsets(NONVOTE_EXTRAS.map(e => e.code as number))) for (const weighted of [false, true]) {
      const way: Way = { item, distrust, nonvote, else0: false, weighted };
      blocks.push([`rCodeFor ${JSON.stringify(way)}`, rCodeFor(way)]);
    }
  }
  assert.ok(blocks.length > 500);
  for (const [name, code] of blocks) assert.deepEqual(rStyleProblems(code), [], name);
});

test('the layout check catches the old squeezed style', () => {
  assert.notDeepEqual(rStyleProblems('allbus %>% crosstab(a, b, percentages = "col")'), []);
  assert.notDeepEqual(rStyleProblems('allbus <- allbus %>%\n  mutate(x = rec(a, rules = "1=1"))'), []);
  assert.notDeepEqual(rStyleProblems('allbus %>%\n  frequency(x)   # prüfen'), []);
});
