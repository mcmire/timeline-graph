export default class GenericIterator {
  constructor(values) {
    this.values = values;
    this.index = 0;
  }

  next() {
    if (this.index < this.values.length) {
      const result = {
        done: false,
        value: this.values[this.index],
      };
      this.index++;
      return result;
    } else {
      this.index = 0;
      return { done: true };
    }
  }
}

