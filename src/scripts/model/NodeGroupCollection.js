import _ from "lodash";

export default class NodeGroupCollection {
  constructor(nodeGroups) {
    this.nodeGroups = nodeGroups;
    this.length = nodeGroups.length;
  }

  map(fn) {
    return this.nodeGroups.map(fn);
  }

  at(index) {
    return this.nodeGroups[index];
  }

  get last() {
    return this.nodeGroups[this.nodeGroups.length - 1];
  }

  reduce(fn, initial) {
    return this.nodeGroups.reduce(fn, initial);
  }

  getAllNodes() {
    return _.sortBy(
      _.flatMap(this.nodeGroups, nodeGroup => nodeGroup.toArray()),
      "index"
    );
  }

  toArray() {
    return this.nodeGroups;
  }
}
