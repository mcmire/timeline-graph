import _ from "lodash";
import applyOrderingRules from "./applyOrderingRules";
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

function generateInitialOrderingRulesFrom(relationships) {
  return relationships.reduce((array, rel) => {
    const from = _.map(rel.from, "event.company.index");
    const to = _.map(rel.to, "event.company.index");

    if (_.uniq(from.concat(to)).length === 1) {
      return array;
    } else {
      return [...array, { from: from, to: to, type: rel.type }];
    }
  }, []);
}

function normalizeOrderingRules(orderingRules) {
  return orderingRules.map(({ type, from, to }) => {
    return (type === "source" ? [from[0], to[0], from[1]] : from.concat(to));
  });
}

function determineCompanyIndexOrder(relationships) {
  const initialOrderingRules = generateInitialOrderingRulesFrom(relationships);
  console.log("initialOrderingRules", initialOrderingRules);
  const normalizedOrderingRules = normalizeOrderingRules(initialOrderingRules);
  console.log("normalizedOrderingRules", normalizedOrderingRules);
  const appliedOrderingRules = applyOrderingRules(normalizedOrderingRules);
  return appliedOrderingRules;
}

export default function buildNodeGroups(companies, nodes, relationships) {
  const nodesByCompanyIndex = _.groupBy(nodes, "event.company.index");
  const companyIndices = Object.keys(nodesByCompanyIndex)
    .map(Number)
    .reduce(
      (array, index) => {
        if (array.indexOf(index) === -1) {
          return [...array, index];
        } else {
          return array;
        }
      },
      determineCompanyIndexOrder(relationships),
    );

  console.log("reallyReallyFinalOrder", companyIndices);

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
