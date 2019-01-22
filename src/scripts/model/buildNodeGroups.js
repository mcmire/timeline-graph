import RuleTree, { RuleTreeError } from "./RuleTree";
import _ from "lodash";
import GroupedNode from "./GroupedNode";
import NodeGroup from "./NodeGroup";
import NodeGroupCollection from "./NodeGroupCollection";
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
  return _.sortBy(
    orderingRules.map(({ type, from, to }) => {
      if (type === "source" && from.length > 1) {
        return [from[0], to[0], from[1]];
      } else {
        return from.concat(to);
      }
    }),
    (rule) => rule[0]
  );
}

function applyOrderingRules(ruleChains) {
  const combinedRuleTree = ruleChains.reduce((ruleTree, ruleChain) => {
    //console.log("ruleTree", JSON.stringify(ruleTree.toDeepArray()));
    //console.log("ruleChain", ruleChain);
    try {
      return ruleTree.mergedWith(ruleChain);
    } catch (error) {
      if (error instanceof RuleTreeError) {
        console.error("Couldn't apply", ruleChain);
        // Don't worry about it
        return ruleTree;
      } else {
        throw error;
      }
    }
  }, new RuleTree());

  return combinedRuleTree.flattened();
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
