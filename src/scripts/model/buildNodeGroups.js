import _ from "lodash";
import GroupedNode from "./GroupedNode";
import NodeGroup from "./NodeGroup";
import NodeGroupCollection from "./NodeGroupCollection";
import spliceInto from "./spliceInto";
import wrapNodes from "./wrapNodes";

function generateInitialOrderingRulesFrom(relationships) {
  //console.log("relationships", relationships);

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
    if (type === "source") {
      return [from[0], to[0], from[1]];
    } else {
      return from.concat(to);
    }
  });
}

function applyOrderingRules(orderingRules) {
  return orderingRules.reduce((masterRule, rule) => {
    return spliceInto(masterRule, rule);
  }, []);
}

function determineCompanyIndexOrder(relationships) {
  const initialOrderingRules = generateInitialOrderingRulesFrom(relationships);
  //console.log("initialOrderingRules", initialOrderingRules);
  const normalizedOrderingRules = normalizeOrderingRules(initialOrderingRules);
  //console.log("normalizedOrderingRules", normalizedOrderingRules);
  const appliedOrderingRules = applyOrderingRules(normalizedOrderingRules);
  //console.log("appliedOrderingRules", appliedOrderingRules);
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

  //console.log("reallyReallyFinalOrder", companyIndices);

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
