import nanoid from "nanoid";

export default class GraphNode {
  constructor({ event, index }) {
    this.event = event;
    this.index = index;

    this.companyIndex = this.event.company.index;
    this.id = nanoid();
  }

  cloneWith({ event = this.event, index = this.index, ...rest }) {
    return new this.constructor({ event, index, ...rest });
  }
}
