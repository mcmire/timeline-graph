import _ from "lodash";

function wrapNode(node, constructor, args, results) {
  /*
  const wrappedRelationships = node.relationships.map(relationship => {
    const wrappedRelationshipNode =
      results.wrappedNodesById[relationship.node.id];

    if (wrappedRelationshipNode == null) {
      throw new Error("Can't find node for relationship");
    } else {
      return { ...relationship, node: wrappedRelationshipNode };
    }
  });
  */

  const wrappedNode = new constructor({
    ...node,
    ...args,
    //relationships: wrappedRelationships,
  });

  return {
    wrappedNodes: results.wrappedNodes.concat([wrappedNode]),
    wrappedNodesById: {
      ...results.wrappedNodesById,
      [node.id]: wrappedNode,
    },
  };
}

export default function wrapNodes({ nodes, constructor, args: argsOrFn }) {
  const { wrappedNodes } = nodes.reduce(
    (results, node) => {
      let args;

      if (_.isFunction(argsOrFn)) {
        args = argsOrFn(node);
      } else {
        args = argsOrFn;
      }

      return wrapNode(node, constructor, args, results);
    },
    { wrappedNodes: [], wrappedNodesById: {} }
  );

  return wrappedNodes;
}
