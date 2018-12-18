import _ from "lodash";

export default function reindexNodes(nodes) {
  const originalNodeIndicesById = nodes.reduce((object, node) => {
    return { ...object, [node.id]: node.index };
  }, {});

  const reindexedNodes = nodes.reduce((array, node) => {
    const lastNodesByCompanyId = _.keyBy(array, "event.company.index");

    if (node.event.data.sources != null) {
      const sources = node.event.data.sources;
      const firstParentCompany = sources[0];
      const lastParentNode = lastNodesByCompanyId[firstParentCompany.index];

      return array
        .slice(0, lastParentNode.index + 1)
        .concat([
          node.cloneWith({ index: lastParentNode.index + 1 }),
        ])
        .concat(
          array.slice(lastParentNode.index + 1).map(n => {
            return n.cloneWith({ index: n.index + 1 });
          })
        );
    } else if (node.event.data.contributors != null) {
      const contributors = node.event.data.contributors;
      const firstParentCompany = contributors[0];
      const lastParentNode = lastNodesByCompanyId[firstParentCompany.index];

      return array
        .slice(0, lastParentNode.index + 1)
        .concat([
          node.cloneWith({ index: lastParentNode.index + 1 }),
        ])
        .concat(
          array.slice(lastParentNode.index + 1).map(n => {
            return n.cloneWith({ index: n.index + 1 });
          })
        );
    } else if (node.event.data.parentCompany != null) {
      const parentCompany = node.event.data.parentCompany;
      const lastParentNode = lastNodesByCompanyId[parentCompany.index];

      return array
        .slice(0, lastParentNode.index + 1)
        .concat([
          node.cloneWith({ index: lastParentNode.index + 1 }),
        ])
        .concat(
          array.slice(lastParentNode.index + 1).map(n => {
            return n.cloneWith({ index: n.index + 1 });
          })
        );
    } else {
      return array.concat([node]);
    }
  }, []);

  return _.sortBy(reindexedNodes, node => {
    return originalNodeIndicesById[node.id];
  });
}
