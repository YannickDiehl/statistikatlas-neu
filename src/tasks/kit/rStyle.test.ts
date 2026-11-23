import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rStyleProblems } from './rStyle';

const GOOD = `library(tidyverse)
library(mariposa)

allbus <- read_spss(file.choose())
# oder direkt, wenn die Datei im Arbeitsverzeichnis liegt:
# allbus <- read_spss("ZA8831_v1-3-0.sav")

# Im Codebuch mit Strg/Cmd + F nach ps03 suchen
codebook(allbus)

# Umpolen und zusammenfassen
allbus <- allbus %>%
  mutate(
    zufriedenheit = rec(ps03, rules = "rev"),
    gut           = rec(ep01, rules = "1:2=1 [gut]; 3:5=0 [nicht gut]; else=NA"),
    zahl          = row_sums(pick(a, b), min_valid = 2)
  )

# Nur West
allbus %>%
  filter(eastwest == 1) %>%
  goodman_gamma(zufriedenheit, ep01, weights = wghtpew)

# Grafik
allbus %>%
  filter(!is.na(ls01)) %>%
  ggplot(aes(x = ls01)) +
  geom_bar() +
  labs(x = "Lebenszufriedenheit", y = "Anzahl")

modell <- allbus %>%
  linear_regression(zufriedenheit ~ x1 + x2, weights = wghtpew)

modell %>%
  summary()
`;

test('a cleanly formatted script has no problems', () => {
  assert.deepEqual(rStyleProblems(GOOD), []);
});

test('finds squeezed code', () => {
  const bad = rStyleProblems([
    'allbus %>% frequency(pv01)',
    'allbus <- allbus %>%',
    '  mutate(a = rec(x, rules = "rev"))',
    'allbus %>%',
    '  crosstab(a, b)   # Zeilen',
    'ggplot(bild, aes(x = a)) + geom_bar()',
    'allbus <- allbus %>%',
    '  mutate(',
    '    a = rec(x, rules = "rev"), b = rec(y, rules = "rev"))',
  ].join('\n'));
  const has = (re: RegExp) => assert.ok(bad.some(p => re.test(p)), `${re} in ${bad.join(' | ')}`);
  has(/Zeile 1: nach %>%/);
  has(/Zeile 3: nach mutate\(/);
  has(/Zeile 4: Leerzeile/);
  has(/Zeile 5: Kommentar hinter Code/);
  has(/Zeile 6: ggplot-Schicht/);
  has(/jede neue Variable in eigene Zeile/);
  has(/schließende Klammer von mutate/);
});

test('ignores symbols inside strings and model formulas', () => {
  assert.deepEqual(rStyleProblems('allbus <- allbus %>%\n  mutate(\n    a = rec(x, rules = "1=1 [a #1 + b %>% c]; else=NA")\n  )'), []);
  assert.deepEqual(rStyleProblems('modell <- allbus %>%\n  linear_regression(y ~ x1 + x2 * x3)'), []);
});
