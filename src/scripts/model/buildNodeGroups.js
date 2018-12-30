import _ from "lodash";
import GroupedNode from "./GroupedNode";
import wrapNodes from "./wrapNodes";

class NodeGroup {
  constructor({ companies, nodes, index }) {
    this.companies = companies;
    this.nodes = nodes;
    this.index = index;
    this.height = _.max(_.map(this.nodes, "height"));
  }

  toArray() {
    return this.nodes;
  }
}

class NodeGroupCollection {
  constructor(nodeGroups) {
    this.nodeGroups = nodeGroups;
    this.length = nodeGroups.length;
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
}

export default function buildNodeGroups(companies, nodes) {
  const groupedNodes = wrapNodes({
    args: (node) => {
      return { nodeGroupIndex: node.event.company.index };
    },
    constructor: GroupedNode,
    nodes: nodes,
  });
  const groupedNodesByCompanyIndex =
    _.groupBy(groupedNodes, "event.company.index");
  const companyIndices = Object.keys(groupedNodesByCompanyIndex)
    .map(Number)
    .sort((a, b) => a - b);

  return new NodeGroupCollection(
    companyIndices.map(companyIndex => {
      return new NodeGroup({
        companies: companies.findAllByIndex(companyIndex),
        index: companyIndex,
        nodes: groupedNodesByCompanyIndex[companyIndex],
      });
    })
  );
}
