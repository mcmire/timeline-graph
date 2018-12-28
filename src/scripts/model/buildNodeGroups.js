import _ from "lodash";
import GroupedNode from "./GroupedNode";
import wrapNodes from "./wrapNodes";

class NodeGroup {
  constructor({ nodes, index }) {
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
      const nodeGroupIndex = companies.indexOf(node.event.company);

      if (nodeGroupIndex === -1) {
        //console.log("companies", companies);
        throw new Error(`Can't find company ${node.event.company.id}`);
      }

      return { nodeGroupIndex };
    },
    constructor: GroupedNode,
    nodes: nodes,
  });
  //console.log("groupedNodes", groupedNodes);
  const nodesByCompanyId = _.groupBy(groupedNodes, "event.company.id");

  return new NodeGroupCollection(
    companies.map((company, index) => {
      return new NodeGroup({
        index: index,
        nodes: nodesByCompanyId[company.id],
      });
    })
  );
}
