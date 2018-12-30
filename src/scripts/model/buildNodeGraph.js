export default function buildNodeGraph(originalNodes) {
  const lastNodesByCompanyId = {};

  return originalNodes.map(node => {
    const eventType = node.event.type;
    const companyId = node.event.company.id;
    const data = node.event.data;
    const relationships = [];

    function buildRelationshipTo(n) {
      return { eventType: eventType, node: n };
    }

    const lastNodeOfSameCompany = lastNodesByCompanyId[companyId];
    if (lastNodeOfSameCompany != null) {
      relationships.push(buildRelationshipTo(lastNodeOfSameCompany));
    }

    if (data.sources != null) {
      data.sources.forEach(company => {
        relationships.push(
          buildRelationshipTo(lastNodesByCompanyId[company.id])
        );
      });
    }

    if (data.contributors != null) {
      data.contributors.forEach(company => {
        relationships.push(
          buildRelationshipTo(lastNodesByCompanyId[company.id])
        );
      });
    }

    if (data.parentCompany != null) {
      relationships.push(
        buildRelationshipTo(lastNodesByCompanyId[data.parentCompany.id])
      );
    }

    if (data.oldCompany != null) {
      relationships.push(
        buildRelationshipTo(lastNodesByCompanyId[data.oldCompany.id])
      );
    }

    const newNode = node.cloneWith({ relationships });
    lastNodesByCompanyId[companyId] = newNode;

    return newNode;
  });
}
