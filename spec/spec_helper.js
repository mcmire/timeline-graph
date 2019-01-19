import { isArray, isFunction, isObject, isString, zip } from "lodash";
import util from "util";

function isIterable(value) {
  return isFunction(value[Symbol.iterator]);
}

function toArray(value) {
  if (isFunction(value.toArray)) {
    return value.toArray();
  } else {
    return value;
  }
}

function treesOrValuesEqual(value1, value2) {
  if (
    isObject(value1) && isObject(value2) &&
    value1.constructor === value2.constructor &&
    isIterable(value1) && isIterable(value2) &&
    value1.length === value2.length
  ) {
    const value1AsArray = toArray(value1);
    const value2AsArray = toArray(value2);
    return zip(value1AsArray, value2AsArray)
      .every(([_value1AsArray, _value2AsArray]) => {
        return treesOrValuesEqual(_value1AsArray, _value2AsArray);
      });
  } else {
    return Object.is(value1, value2);
  }
}

function inspectTreeOrValue(value) {
  if (value.isTree) {
    const contents = value.map(inspectTreeOrValue).join(", ");
    return value.constructor.name + "("+ contents + ")";
  } else if (isArray(value)) {
    return "[" + value.map(inspectTreeOrValue).join(", ") + "]";
  } else {
    return JSON.stringify(value);
  }
}

global.inspect = (...values) => {
  const inspectedValues = values.map(value => {
    if (isString(value)) {
      return value;
    } else {
      return util.inspect(value, { depth: null });
    }
  });

  console.log(...inspectedValues);
};

expect.extend({
  toEqualTree(actualTree, expectedTree) {
    const pass = treesOrValuesEqual(actualTree, expectedTree);

    if (pass) {
      return {
        message() {
          return `Expected ${inspectTreeOrValue(actualTree)} and ` +
            `${inspectTreeOrValue(expectedTree)} not to be equal trees`;
        },
        pass: pass,
      };
    } else {
      return {
        message() {
          return `Expected ${inspectTreeOrValue(actualTree)} and ` +
            `${inspectTreeOrValue(expectedTree)} to be equal trees`;
        },
        pass: pass,
      };
    }
  },
});
