import { clone, isArray, isNumber, isPlainObject } from "lodash";

function normalize(value, parent) {
  if (value instanceof RuleChain) {
    return value.clonedWith({ parent });
  } else if (isArray(value)) {
    return new RuleChain(...value, { parent });
  } else {
    return value;
  }
}

function denormalize(value) {
  if (value instanceof RuleChain) {
    const values = [];
    value.forEach(v => {
      values.push(denormalize(v));
    });
    return values;
  } else {
    return value;
  }
}

function deepClone(values) {
  return values.map(value => {
    if (value instanceof RuleChain) {
      return value.cloned();
    } else {
      return clone(value);
    }
  });
}

export default class RuleChain extends Array {
  constructor(...values) {
    let config;

    if (isPlainObject(values[values.length - 1])) {
      config = values.pop();
    } else {
      config = {};
    }

    // This is one too many operations but we have to do this to get around the
    // limitation of `new Array` — awesomely, if you pass in a single argument
    // and it is a number then it thinks that you want to set the length of the
    // array
    super();

    if (values.length > 0) {
      this.push(...values.map(value => normalize(value, this)));
    }

    this.parent = config.parent;

    this.isTree = true;
  }

  getRoot() {
    if (this.parent == null) {
      return this;
    } else {
      return this.parent.getRoot();
    }
  }

  clonedWith({ values = this, parent = this.parent } = {}) {
    return new this.constructor(...deepClone(values), { parent });
  }

  cloned() {
    return this.clonedWith();
  }

  isEmpty() {
    return this.length === 0;
  }

  sliced(...args) {
    return this.slice(...args);
  }

  isShallow() {
    return this.every(isNumber);
  }

  has(number) {
    if (isNumber(number)) {
      return this.indexOf(number) !== -1;
    } else {
      throw new Error("Must be given a number");
    }
  }

  withIndicesRemoved(...indices) {
    const _clone = this.cloned();

    indices.sort().reverse().forEach(i => {
      _clone.splice(i, 1);
    });

    return _clone;
  }

  toDeepArray() {
    return denormalize(this);
  }
}

RuleChain.Shallow = (...values) => {
  if (values.every(isNumber)) {
    return new RuleChain(...values);
  } else {
    throw new Error("Given rule chain is not shallow, i.e., one-dimensional");
  }
};
