//import util from "util";
import { chain, flattenDeep, fromPairs, get, map, uniq } from "lodash";
import GenericIterator from "./GenericIterator";
import RuleChain from "./RuleChain";

const _getAt = Symbol("getAt");
const _locate = Symbol("locate");
const _locatePillarsFrom = Symbol("locatePillarsFrom");
const _ruleChains = Symbol("ruleChains");
const _withAdditionOf = Symbol("add");
const _withInsertionAt = Symbol("insertAt");

function locate(
  collection,
  numberToLocate,
  collectionPath = [],
  absoluteIndex = 0
) {
  for (let index = 0; index < collection.length; index++) {
    const value = collection[index];

    if (value instanceof RuleChain) {
      const location = locate(
        value,
        numberToLocate,
        collectionPath.concat([index]),
        absoluteIndex + index
      );

      if (location != null) {
        // exit early
        return location;
      }
    } else if (value === numberToLocate) {
      // exit early
      return {
        absoluteIndex: absoluteIndex + index,
        //collection: collection,
        collectionPath: collectionPath,
        indexInCollection: index,
        //value: value,
      };
    }
  }

  return null;
}

/*
function deepClone(ruleChains) {
  return ruleChains.map(ruleChain => ruleChain.cloned());
}
*/

function isMonotonicallyIncreasing(numbers) {
  const result = numbers.reduce(({ isIncreasing, previousNumber }, number) => {
    return {
      isIncreasing: (
        isIncreasing &&
        (previousNumber == null || number > previousNumber)
      ),
      previousNumber: number,
    };
  }, { isIncreasing: true, previousNumber: null });

  return result.isIncreasing;
}

export class RuleTreeError extends Error {}

export default class RuleTree {
  constructor(...ruleChains) {
    this[_ruleChains] = ruleChains.map(ruleChain => {
      if (ruleChain instanceof Array) {
        return new RuleChain(...ruleChain, { parent: null });
      } else {
        throw new Error("All arguments must be arrays or RuleChains");
      }
    });
    this.length = this[_ruleChains].length;
    this.isTree = true;
  }

  [Symbol.iterator]() {
    return new GenericIterator(this[_ruleChains]);
  }

  map(fn) {
    return this[_ruleChains].map(fn);
  }

  cloned() {
    return this.clonedWith(this[_ruleChains]);
  }

  clonedWith(ruleChains) {
    return new this.constructor(...ruleChains);
  }

  isEmpty() {
    return this[_ruleChains].length === 0;
  }

  mergedWith(rawRuleChain) {
    const ruleChain = new RuleChain.Shallow(...rawRuleChain);

    // XXX: This won't work with nested chains
    /*
    if (ruleChain.every(value => ruleChain.has(value))) {
      return this;
    } else
    */
    if (this.isEmpty() && !ruleChain.isEmpty()) {
      return this[_withAdditionOf](ruleChain);
    } else if (!this.isEmpty() && ruleChain.isEmpty()) {
      return this;
    } else {
      const pillars = this[_locatePillarsFrom](ruleChain);
      const pillarsSucceedEachOther = isMonotonicallyIncreasing(
        map(pillars, "locationInRuleTree.absoluteIndex")
      );

      //debugger
      //console.log("ruleChains", JSON.stringify(this[_ruleChains], null, 4));
      //console.log("pillars", JSON.stringify(pillars, null, 4));

      if (pillarsSucceedEachOther) {
        if (pillars.length === ruleChain.length) {
          return this;
        } else if (pillars.length > 0) {
          const lastPillar = pillars[pillars.length - 1];
          const ruleChainWithoutExistingValues = ruleChain.withIndicesRemoved(
            ...pillars.slice(0, -1).map(pillar => pillar.indexInSource)
          );

          return this[_withInsertionAt](
            lastPillar.locationInRuleTree,
            ruleChainWithoutExistingValues
          );
        } else {
          return this[_withAdditionOf](ruleChain);
        }
      } else {
        const rootRuleChainPathsFromPillars = chain(pillars)
          .map(pillar => pillar.locationInRuleTree.collectionPath[0])
          .value();
        const rootRuleChainsFromPillars = rootRuleChainPathsFromPillars
          .map(path => this[_getAt](path));
        const allPillarsAreInSeparateRuleChains =
          uniq(rootRuleChainPathsFromPillars).length === pillars.length;

        if (
          pillars.length === ruleChain.length &&
          allPillarsAreInSeparateRuleChains
        ) {
          const rearrangedRuleChains = [];
          let newRuleChainIndex = 0;
          this[_ruleChains].forEach((oldRuleChain, oldRuleChainIndex) => {
            if (rootRuleChainPathsFromPillars.indexOf(oldRuleChainIndex) !== -1) {
              rearrangedRuleChains.push(
                rootRuleChainsFromPillars[newRuleChainIndex]
              );
              newRuleChainIndex++;
            } else {
              rearrangedRuleChains.push(oldRuleChain);
            }
          });
          return new this.constructor(...rearrangedRuleChains);
        } else {
          throw new RuleTreeError(
            "Merge failed: Indices for common values in target are not in " +
            "same order as source"
          );
        }
      }
    }
  }

  flattened() {
    return flattenDeep(this.toDeepArray());
  }

  toArray() {
    return this[_ruleChains];
  }

  toDeepArray() {
    return this[_ruleChains].map(ruleChain => ruleChain.toDeepArray());
  }

  [_locatePillarsFrom](ruleChain) {
    return ruleChain.reduce((array, value, indexInSource) => {
      const locationInRuleTree = this[_locate](value);

      if (locationInRuleTree == null) {
        return array;
      } else {
        return array.concat([{ indexInSource, locationInRuleTree }]);
      }
    }, []);
  }

  [_locate](value) {
    return locate(this[_ruleChains], value);
  }

  [_withInsertionAt](location, ruleChain) {
    const _clone = this.cloned();
    const foundRuleChain = _clone[_getAt](location.collectionPath);
    //debugger
    foundRuleChain.splice(location.indexInCollection, 1, ruleChain);
    return _clone;
  }

  [_getAt](path) {
    return get(this[_ruleChains], path);
  }

  [_withAdditionOf](ruleChain) {
    return this.clonedWith([...this[_ruleChains], ruleChain]);
  }
}
