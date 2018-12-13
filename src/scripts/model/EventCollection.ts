import _ from "lodash";
import buildEvent from "./buildEvent";

const eventsSymbol = Symbol("events");
const lastIdSymbol = Symbol("lastId");

export default class EventCollection {
  constructor({ events = [], lastId = -1 } = {}) {
    Object.defineProperty(
      this,
      eventsSymbol,
      { value: events, enumerable: false }
    );
    Object.defineProperty(
      this,
      lastIdSymbol,
      { value: lastId, enumerable: false, writable: true }
    );
  }

  forEach(fn) {
    return this[eventsSymbol].forEach(fn);
  }

  map(fn) {
    return this[eventsSymbol].map(fn);
  }

  sorted(fn) {
    return this.clone()._sort(fn);
  }

  cloneWith({
    events = _.clone(this[eventsSymbol]),
    lastId = this[lastIdSymbol]
  }) {
    return new this.constructor({ events, lastId });
  }

  clone() {
    return this.cloneWith({});
  }

  add(eventAttributes) {
    const existingEvent = this[eventsSymbol].find(event => {
      return _.isEqual(event.attributes, eventAttributes);
    });

    if (existingEvent == null) {
      const newId = this[lastIdSymbol] + 1;
      const newEvent = buildEvent({
        ...eventAttributes,
        id: newId
      });
      return this.cloneWith({
        events: [ ...this[eventsSymbol], newEvent ],
        lastId: newId
      });
    } else {
      return this;
    }
  }

  toArray() {
    return this[eventsSymbol];
  }

  _sort(fn) {
    this[eventsSymbol].sort(fn);
    return this;
  }
}
