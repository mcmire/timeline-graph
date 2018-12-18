import nanoid from "nanoid";

export default class GraphNode {
  constructor({ event, index, id = nanoid(), parents = [] }) {
    this.event = event;
    this.index = index;
    this.parents = parents;
    this.id = id;
  }

  cloneWith({
    event = this.event,
    index = this.index,
    id = this.id,
    parents = this.parents,
    ...rest
  }) {
    return new this.constructor({ event, index, id, parents, ...rest });
  }
}
