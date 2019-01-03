import _ from "lodash";

export class CouldNotAlignSequencesError extends Error { }

// TODO: Clean this up
export default function alignSequences({
  target: targetSequence,
  source: sourceSequence,
}) {
  const newTargetSequence = _.clone(targetSequence);
  let newSourceSequence = _.clone(sourceSequence);
  const pillars = [];
  let intersection = [];

  if (newSourceSequence.length > 0) {
    let lastIndexInTarget;

    for (
      let indexInSource = 0;
      indexInSource < newSourceSequence.length;
      indexInSource++
    ) {
      const value = newSourceSequence[indexInSource];

      let indexInTarget = newTargetSequence.indexOf(value);

      if (indexInTarget === -1) {
        intersection.push(null);
      } else if (lastIndexInTarget != null && indexInTarget < lastIndexInTarget) {
        const previousValue = newTargetSequence[lastIndexInTarget];
        const conflictingValue = value;
        const error = new CouldNotAlignSequencesError(
          "Could not align sequences: " +
          `${previousValue} and ${conflictingValue} are present in both ` +
          "sequences, but they cross each other."
        );
        error.previousValue = previousValue;
        error.conflictingValue = conflictingValue;
        throw error;
      } else {
        if (indexInTarget > indexInSource) {
          const numberOfValuesToInsert = indexInTarget - indexInSource;
          const nullsToInsert = _.times(numberOfValuesToInsert, () => null);
          newSourceSequence.splice(indexInSource, 0, ...nullsToInsert);
          indexInSource += numberOfValuesToInsert;
          intersection.push(...nullsToInsert);
        } else if (indexInSource > indexInTarget) {
          const numberOfValuesToInsert = indexInSource - indexInTarget;
          const nullsToInsert = _.times(numberOfValuesToInsert, () => null);
          newTargetSequence.splice(indexInTarget, 0, ...nullsToInsert);
          indexInTarget += numberOfValuesToInsert;
        }

        pillars.push(indexInTarget);
        intersection.push(value);

        lastIndexInTarget = indexInTarget;
      }
    }

    const numberOfMissingValuesFromSource = (
      newTargetSequence.length -
      newSourceSequence.length
    );
    _.times(numberOfMissingValuesFromSource, () => {
      newSourceSequence.push(null);
      intersection.push(null);
    });
  } else {
    newSourceSequence = _.times(newTargetSequence.length, () => null);
    intersection = _.times(newTargetSequence.length, () => null);
  }

  return {
    intersection: intersection,
    pillars: pillars,
    source: newSourceSequence,
    target: newTargetSequence,
  };
}
