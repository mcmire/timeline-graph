class Relationship {
  constructor({ from, to, type }) {
    if (from == null) {
      throw new Error(`${this.constructor.name}: No from given`);
    }

    if (to == null) {
      throw new Error(`${this.constructor.name}: No to given`);
    }

    if (type == null) {
      throw new Error(`${this.constructor.type}: No type given`);
    }

    // "subjects" or "children"
    this.from = from;
    // "objects" or "parents"
    this.to = to;
    // <from> is a ___ of <to>
    this.type = type;
  }
}

class StrictMap extends Map {
  fetch(key) {
    if (this.has(key)) {
      return this.get(key);
    } else {
      throw new Error(`Couldn't find key: ${JSON.stringify(key)}`);
    }
  }
}

export default function buildNodeGraph(nodes) {
  const relationships = [];
  const lastOccurringNodesByCompany = new StrictMap();
  const addRelationship = (args) => {
    relationships.push(new Relationship(args));
  };

  nodes.forEach((node, _nodeIndex) => {
    const event = node.event;
    const company = event.company;

    if (event.type === "merger") {
      addRelationship({
        from: event.data.sources.map(source => {
          return lastOccurringNodesByCompany.fetch(source);
        }),
        to: [node],
        type: "merger",
      });
    } else if (event.type === "jointVenture") {
      addRelationship({
        from: event.data.contributors.map(contributor => {
          return lastOccurringNodesByCompany.fetch(contributor);
        }),
        to: [node],
        type: "jointVenture",
      });
    } else if (
      event.type !== "incorporation" &&
      event.type !== "spinoff" &&
      event.type !== "jointVenture" &&
      event.type !== "transfer"
    ) {
      addRelationship({
        from: [node],
        to: [lastOccurringNodesByCompany.fetch(company)],
        type: "predecessor",
      });
    }

    if (event.type === "transfer") {
      addRelationship({
        from: [node],
        to: [lastOccurringNodesByCompany.fetch(event.data.oldCompany)],
        type: "predecessor",
      });
    }

    if (event.data.childCompany != null) {
      addRelationship({
        from: [lastOccurringNodesByCompany.fetch(event.data.childCompany)],
        to: [node],
        type: "subsidiary",
      });
    } else if (event.data.parentCompany != null) {
      addRelationship({
        from: [lastOccurringNodesByCompany.fetch(event.data.parentCompany)],
        to: [node],
        type: "subsidiary",
      });
    }

    lastOccurringNodesByCompany.set(company, node);

    /*
    const eventType = node.event.type;
    const companyId = node.event.company.id;
    const data = node.event.data;

    function buildRelationshipTo(n) {
      return { eventType: eventType, node: n };
    }

    const lastNodeOfSameCompany = lastOccurringNodesByCompanyId[companyId];
    if (lastNodeOfSameCompany != null) {
      relationships.push(buildRelationshipTo(lastNodeOfSameCompany));
    }

    if (data.sources != null) {
      data.sources.forEach(company => {
        relationships.push(
          buildRelationshipTo(lastOccurringNodesByCompanyId[company.id])
        );
      });
    }

    if (data.contributors != null) {
      data.contributors.forEach(company => {
        relationships.push(
          buildRelationshipTo(lastOccurringNodesByCompanyId[company.id])
        );
      });
    }

    if (data.parentCompany != null) {
      relationships.push(
        buildRelationshipTo(lastOccurringNodesByCompanyId[data.parentCompany.id])
      );
    }

    if (data.oldCompany != null) {
      relationships.push(
        buildRelationshipTo(lastOccurringNodesByCompanyId[data.oldCompany.id])
      );
    }

    const newNode = node.cloneWith({ relationships });
    lastOccurringNodesByCompanyId[companyId] = newNode;

    return newNode;
    */
  });

  return relationships;
}
