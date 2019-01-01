import _ from "lodash";

/*
function numericallySort(array) {
  return _.clone(array).sort((a, b) => a - b);
}

function equalSets(set1, set2) {
  return _.isEqual(numericallySort(set1), numericallySort(set2));
}

function concatAsSet(set1, set2) {
  if (equalSets(set1, set2)) {
    return set2;
  } else {
    return set2.reduce((finalSet, value) => {
      const index = finalSet.indexOf(value);

      if (index !== -1) {
        return [
          ...finalSet.slice(0, index),
          ...finalSet.slice(index + 1),
          value,
        ];
      } else {
        return [...finalSet, value];
      }
    }, set1);
  }
}

function concatAsSet(set1, set2) {
  return set2.reduce((newSet, value) => {
    if (newSet.indexOf(value) !== -1) {
      return newSet;
    } else {
      return [...newSet, value];
    }
  }, set1);
}
*/

function tuplesOf(array, tupleLength) {
  const tuples = [];

  for (let i = 0; i < array.length - 1; i += 1) {
    tuples.push(array.slice(i, i + tupleLength));
  }

  return tuples;
}

function insertBefore(index, value, array) {
  const copy = _.clone(array);
  copy.splice(index, 0, value);
  return copy;
}

function insertAfter(index, value, array) {
  return insertBefore(index + 1, value, array);
}

/*
function isStrictSubsetOf(set, possibleSubset) {
  const indexOfFirstValue = set.indexOf(possibleSubset[0]);

  if (indexOfFirstValue === -1) {
    return false;
  } else {
    return _.range(1, possibleSubset.length).every(i => {
      return set[indexOfFirstValue + i] === possibleSubset[i];
    });
  }
}

function spliceInto(series1, series2) {
  const results = series2.reduce(({ previousIndex, series }, value, i) => {
    const index = series.indexOf(value);

    if (index !== -1) {
      if (previousIndex == null) {
        return {
          previousIndex: index,
          series: series,
        };
      } else if (index > previousIndex) {
        // That's totally cool, leave it where it is
        return {
          previousIndex: index,
          series: series,
        };
      } else {
        throw new Error(
          "Error adding index to set: conflicting rule. " +
          `${JSON.stringify(value)} exists before ` +
          `${JSON.stringify(series2[i - 1])}, but it should be after.`
        );
      }
    } else if (previousIndex == null) {
      return {
        previousIndex: series.length,
        series: _.tap(_.clone(series), array => {
          return array.splice(series.length, 0, value);
        }),
      };
    } else {
      return {
        previousIndex: previousIndex + 1,
        series: _.tap(_.clone(series), array => {
          return array.splice(previousIndex + 1, 0, value);
        }),
      };
    }
  }, { previousIndex: null, series: series1 });

  return results.series;
}
*/

function spliceInto(masterRule, rule) {
  if (rule.length === 1) {
    if (masterRule.indexOf(rule[0]) === -1) {
      return [...masterRule, ...rule];
    } else {
      return masterRule;
    }
  } else {
    const pairs = tuplesOf(rule, 2);
    //console.log("rule", rule, "pairs", pairs);

    return pairs.reduce((newMasterRule, [left, right]) => {
      console.log("newMasterRule", newMasterRule);

      const leftIndex = newMasterRule.indexOf(left);
      const alreadyHasLeft = leftIndex !== -1;
      const rightIndex = newMasterRule.indexOf(right);
      const alreadyHasRight = rightIndex !== -1;

      if (alreadyHasLeft && alreadyHasRight) {
        if (rightIndex > leftIndex) {
          return newMasterRule;
        } else {
          throw new Error(
            "Error adding index to set: conflicting rule. " +
            `${JSON.stringify(right)} exists before ` +
            `${JSON.stringify(left)}, but it should be after.`
          );
        }
      } else if (alreadyHasLeft && !alreadyHasRight) {
        return insertAfter(leftIndex, right, newMasterRule);
      } else if (alreadyHasRight && !alreadyHasLeft) {
        return insertBefore(rightIndex, left, newMasterRule);
      } else {
        return [...newMasterRule, left, right];
      }
    }, masterRule);
  }
}

export default function applyOrderingRules(orderingRules) {
  return orderingRules.reduce((masterRule, rule) => {
    return spliceInto(masterRule, rule);
  }, []);
}
