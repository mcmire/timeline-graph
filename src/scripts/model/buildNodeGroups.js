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

function concatAsSet(set1, set2) {
  return set2.reduce((finalSet, value) => {
    const index = finalSet.indexOf(value);

    if (index !== -1) {
      return [
        ...finalSet.slice(0, index),
        ...finalSet.slice(index + 1),
        value,
      ];
    } else {
      return [...finalSet, value];
    }
  }, set1);
}

function determineCompanyIndexOrder(relationships) {
  const orderingRules = relationships.reduce((array, rel) => {
    const from = _.map(rel.from, "event.company.index");
    const to = _.map(rel.to, "event.company.index");
    const rule = (
      rel.type === "source" ?
        [from[0], to[0], from[1]] :
        (
          rel.type === "acquired" ?
            [...from, ...to].sort((a, b) => a - b) :
            [...from, ...to]
        )
    );

    if (_.uniq(rule).length === 1) {
      return array;
    } else {
      return [...array, rule];
    }
  }, []);

  return orderingRules.reduce((finalOrder, rule) => {
    if (finalOrder.length > 0) {
      const index = finalOrder.indexOf(rule[0]);

      if (index !== -1) {
        return concatAsSet(finalOrder.slice(0, index + 1), rule.slice(1))
          .concat(finalOrder.slice(index + 1));
      } else {
        return concatAsSet(finalOrder, rule);
      }
    } else {
      return rule;
    }
  }, []);
}

export default function buildNodeGroups(companies, nodes, relationships) {
  const nodesByCompanyIndex = _.groupBy(nodes, "event.company.index");
  const companyIndices = determineCompanyIndexOrder(relationships);

  return new NodeGroupCollection(
    companyIndices.map((companyIndex, nodeGroupIndex) => {
      const nodesInCompany = nodesByCompanyIndex[companyIndex];

      const groupedNodes = wrapNodes({
        args: { nodeGroupIndex },
        constructor: GroupedNode,
        nodes: nodesInCompany,
      });

      return new NodeGroup({
        companies: companies.findAllByIndex(companyIndex),
        index: nodeGroupIndex,
        nodes: groupedNodes,
      });
    })
  );
}
