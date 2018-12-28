import _ from "lodash";

function wrapNode(
  node,
  constructor,
  args,
  results,
  { addToNodes = true } = {}
) {
  /*
  const newResults = node.parents
    .filter(parent => parent.isHidden)
    .reduce((_results, parent) => {
      return wrapNode(
        parent,
        constructor,
        args,
        _results,
        { addToNodes: false }
      );
    }, results);
  */

  const wrappedParents = node.parents.map(parent => {
    const wrappedParentNode = results.wrappedNodesById[parent.id];

    if (wrappedParentNode == null) {
      throw new Error("Can't find parent");
    } else {
      return wrappedParentNode;
    }
  });

  const wrappedNode = new constructor({
    ...node,
    ...args,
    parents: wrappedParents,
  });

  /*
  const newWrappedNodes = (
    addToNodes ?
      newResults.wrappedNodes.concat([wrappedNode]) :
      newResults.wrappedNodes
  );
  */

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
