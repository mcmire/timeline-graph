export default function buildNodeGraph(originalNodes) {
  const lastNodesByCompanyId = {};

  return originalNodes.map(node => {
    const companyId = node.event.company.id;
    const data = node.event.data;
    const parents = [];

    const companyNode = lastNodesByCompanyId[companyId];
    if (companyNode != null) {
      parents.push(companyNode);
    }

    if (data.sources != null) {
      parents.push(
        ...data.sources.map(company => {
          return lastNodesByCompanyId[company.id];
        })
      );
    } else if (data.contributors != null) {
      parents.push(
        ...data.contributors.map(company => {
          return lastNodesByCompanyId[company.id];
        })
      );
    } else if (data.parentCompany != null) {
      parents.push(lastNodesByCompanyId[data.parentCompany.id]);
    }

    const newNode = node.cloneWith({ parents: parents });
    lastNodesByCompanyId[companyId] = newNode;

    return newNode;
  });
}
