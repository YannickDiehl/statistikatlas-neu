import test from 'node:test';
import assert from 'node:assert/strict';
import { rStyleProblems } from '../kit/rStyle';
import { GEOMS, hints, QUESTIONS, R_AXIS, R_SETUP, R_SILHOUETTES, R_SKETCH, TOOLBOX_SCRIPT } from './content';
import { planCode, rCodeFor, rSolution, type Plan } from './domain';

/** Jeder Bauplan, den man im Lernpfad zusammenklicken kann – auch die unpassenden und die halb fertigen. */
function allPlans(): [typeof QUESTIONS[number], Plan][] {
  const out: [typeof QUESTIONS[number], Plan][] = [];
  for (const q of QUESTIONS) for (const geom of ['', ...GEOMS.map(g => g.id)] as Plan['geom'][]) {
    for (const [x, second] of [[q.group, q.outcome], [q.outcome, q.group], [q.group, ''], [q.outcome, ''], ['', '']]) out.push([q, { geom, x, second }]);
  }
  return out;
}

test('every R code block of session 4 follows the uniform layout (Schriftbild)', () => {
  const blocks: [string, string][] = [
    ['R_SETUP', R_SETUP], ['TOOLBOX_SCRIPT', TOOLBOX_SCRIPT], ['R_SKETCH', R_SKETCH], ['R_SILHOUETTES', R_SILHOUETTES], ['R_AXIS', R_AXIS],
    ...Object.entries(hints).flatMap(([k, h]): [string, string][] => [[`${k}.scaffold`, h.scaffold ?? ''], [`${k}.solution`, h.solution ?? '']]),
  ];
  for (const [q, plan] of allPlans()) {
    const id = `${q.id} ${plan.geom} ${plan.x}/${plan.second}`;
    blocks.push([`planCode ${id}`, planCode(plan)], [`rCodeFor ${id}`, rCodeFor(q, plan)], [`rSolution ${id}`, rSolution(q, plan)]);
  }
  for (const [name, code] of blocks) assert.deepEqual(rStyleProblems(code), [], name);
});
