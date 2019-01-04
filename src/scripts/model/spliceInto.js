import alignSequences, { CouldNotAlignSequencesError } from "./alignSequences";
import _ from "lodash";

//class CouldNotMergeError extends Error { }

export default function spliceInto(targetRule, sourceRule) {
  if (anyElementsSameBetween(targetRule, sourceRule)) {
    return mergeDifferingSegmentsOf(targetRule, sourceRule);
  } else {
    return targetRule.concat(sourceRule);
  }
}

function anyElementsSameBetween(array1, array2) {
  return _.intersection(array1, array2).length > 0;
}

function mergeDifferingSegmentsOf(targetRule, sourceRule) {
  try {
    const alignment = alignSequences({
      source: sourceRule,
      target: targetRule,
    });
    const ranges = determineSegmentRangesFrom(alignment);
    return arrangeRulesWithin(ranges, alignment);
  } catch (error) {
    if (error instanceof CouldNotAlignSequencesError) {
      /*
      throw new CouldNotMergeError(
        "There are conflicting rules. " +
        `${error.previousValue} and ${error.conflictingValue} are present in ` +
        `both rules, but ${error.conflictingValue} occurs in the target ` +
        `before ${error.previousValue} does, so I'm not sure which order to ` +
        `place things in. source: ${JSON.stringify(sourceRule)}, ` +
        `target: ${JSON.stringify(targetRule)}`
      );
      */
      return targetRule;
    } else {
      throw error;
    }
  }
}

function determineSegmentRangesFrom(result) {
  const bookendedPillars = _.uniq([
    0,
    ...result.pillars,
    result.intersection.length,
  ]);

  return tuplesOf(bookendedPillars, 2).map(([beginning, end]) => {
    return { beginning, end };
  });
}

function tuplesOf(array, tupleLength) {
  const tuples = [];

  for (let i = 0; i < array.length - 1; i += 1) {
    tuples.push(array.slice(i, i + tupleLength));
  }

  return tuples;
}

function arrangeRulesWithin(ranges, alignment) {
  return _.flatMap(ranges, range => {
    const commonValue = alignment.intersection[range.beginning];

    if (commonValue == null) {
      return compact([
        ...alignment.target.slice(range.beginning, range.end),
        ...alignment.source.slice(range.beginning, range.end),
      ]);
    } else {
      return compact([
        commonValue,
        ...alignment.target.slice(range.beginning + 1, range.end),
        ...alignment.source.slice(range.beginning + 1, range.end),
      ]);
    }
  });
}

function compact(array) {
  return array.filter(value => value != null);
}
