import nanoid from "nanoid";

export default class GraphNode {
  constructor({
    event,
    index,
    relationships = [],
  }) {
    this.event = event;
    this.index = index;
    this.relationships = relationships;

    this.company = this.event.company;
    this.id = nanoid();
  }

  cloneWith({
    event = this.event,
    index = this.index,
    relationships = this.relationships,
    ...rest
  }) {
    return new this.constructor({
      event,
      index,
      relationships,
      ...rest,
    });
  }
}
