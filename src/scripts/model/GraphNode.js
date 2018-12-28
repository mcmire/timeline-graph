import nanoid from "nanoid";

export default class GraphNode {
  constructor({
    event,
    index,
    parents = [],
  }) {
    this.event = event;
    this.index = index;
    this.parents = parents;

    this.company = this.event.company;
    this.id = nanoid();
  }

  cloneWith({
    event = this.event,
    index = this.index,
    parents = this.parents,
    ...rest
  }) {
    return new this.constructor({
      event,
      index,
      parents,
      ...rest,
    });
  }
}
