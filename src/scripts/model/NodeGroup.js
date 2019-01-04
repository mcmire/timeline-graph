import _ from "lodash";

export default class NodeGroup {
  constructor({ companies, nodes, index }) {
    this.companies = companies;
    this.nodes = nodes;
    this.index = index;

    this.height = _.max(_.map(this.nodes, "height"));
  }

  cloneWith({
    companies = this.companies,
    nodes = this.nodes,
    index = this.index,
    ...rest
  }) {
    return new this.constructor({
      companies,
      nodes,
      index,
      ...rest,
    });
  }

  toArray() {
    return this.nodes;
  }
}
