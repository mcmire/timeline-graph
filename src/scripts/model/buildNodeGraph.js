export default function buildNodeGraph(originalNodes) {
  const lastNodesByCompanyId = {};

  return originalNodes.map(node => {
    const companyId = node.event.company.index;
    const data = node.event.data;
    const parents = [];

    if (data.sources != null) {
      parents.push(
        ...data.sources.map(company => {
          return lastNodesByCompanyId[company.index];
        })
      );
    } else if (data.contributors != null) {
      parents.push(
        ...data.contributors.map(company => {
          return lastNodesByCompanyId[company.index];
        })
      );
    } else if (data.parentCompany != null) {
      parents.push(lastNodesByCompanyId[data.parentCompany.index]);
    } else {
      const companyNode = lastNodesByCompanyId[companyId];

      if (companyNode != null) {
        parents.push(companyNode);
      }
    }

    const newNode = node.cloneWith({ parents: parents });
    lastNodesByCompanyId[companyId] = newNode;

    return newNode;
  });
}
