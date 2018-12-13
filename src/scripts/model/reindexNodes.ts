import _ from "lodash";

export default function reindexNodes(nodes) {
  const originalNodeIndicesById = nodes.reduce((object, node) => {
    return { ...object, [node.id]: node.index };
  }, {});

  // console.log("nodes", nodes);

  const reindexedNodes = nodes.reduce((reindexedNodes, node) => {
    const lastNodesByCompanyId = _.keyBy(reindexedNodes, "event.company.index");

    if (node.event.data.sources != null) {
      const sources = node.event.data.sources;
      const firstParentCompany = sources[0];
      const lastParentNode = lastNodesByCompanyId[firstParentCompany.index];

      return reindexedNodes
        .slice(0, lastParentNode.index + 1)
        .concat([
          node.cloneWith({ index: lastParentNode.index + 1 })
        ])
        .concat(
          reindexedNodes.slice(lastParentNode.index + 1).map(node => {
            return node.cloneWith({ index: node.index + 1 });
          })
        );
    } else if (node.event.data.contributors != null) {
      const contributors = node.event.data.contributors;
      const firstParentCompany = contributors[0];
      const lastParentNode = lastNodesByCompanyId[firstParentCompany.index];

      return reindexedNodes
        .slice(0, lastParentNode.index + 1)
        .concat([
          node.cloneWith({ index: lastParentNode.index + 1 })
        ])
        .concat(
          reindexedNodes.slice(lastParentNode.index + 1).map(node => {
            return node.cloneWith({ index: node.index + 1 });
          })
        );
    } else if (node.event.data.parentCompany != null) {
      const parentCompany = node.event.data.parentCompany;
      const lastParentNode = lastNodesByCompanyId[parentCompany.index];
      // console.log("node", node);
      // console.log("parentCompany", parentCompany);
      // console.log("lastParentNode", lastParentNode);

      return reindexedNodes
        .slice(0, lastParentNode.index + 1)
        .concat([
          node.cloneWith({ index: lastParentNode.index + 1 })
        ])
        .concat(
          reindexedNodes.slice(lastParentNode.index + 1).map(node => {
            return node.cloneWith({ index: node.index + 1 });
          })
        );
    } else {
      return reindexedNodes.concat([node]);
    }
  }, []);

  // console.log("reindexedNodes", reindexedNodes);

  return _.sortBy(reindexedNodes, node => {
    return originalNodeIndicesById[node.id];
  });
}
