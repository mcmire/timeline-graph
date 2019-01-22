import { isEqual, uniq } from "lodash";

function hasDuplicateIndices(indices) {
  return !isEqual(uniq(indices), indices);
}

class Relationship {
  constructor({ from, to, type }) {
    if (from == null) {
      throw new Error(`${this.constructor.name}: No from given`);
    }

    if (to == null) {
      throw new Error(`${this.constructor.name}: No to given`);
    }

    if (type == null) {
      throw new Error(`${this.constructor.name}: No type given`);
    }

    if (hasDuplicateIndices(from)) {
      throw new Error(`${this.constructor.name}: Duplicate indices in from`);
    }

    if (hasDuplicateIndices(to)) {
      throw new Error(`${this.constructor.name}: Duplicate indices in to`);
    }

    if (hasDuplicateIndices(from.concat(to))) {
      throw new Error(
        `${this.constructor.name}: Some indices in from are repeated in to`
      );
    }

    this.from = from;
    this.to = to;
    // <from> is the ___ of <to>
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
        type: "source",
      });
    } else if (event.type === "jointVenture") {
      addRelationship({
        from: event.data.contributors.map(contributor => {
          return lastOccurringNodesByCompany.fetch(contributor);
        }),
        to: [node],
        type: "source",
      });
    } else if (
      event.type !== "buyout" &&
      event.type !== "formation" &&
      event.type !== "incorporation" &&
      event.type !== "reestablishment" &&
      event.type !== "rename" &&
      event.type !== "spinoff"
    ) {
      addRelationship({
        from: [node],
        to: [lastOccurringNodesByCompany.fetch(company)],
        type: "predecessor",
      });
    }

    if (
      event.type === "buyout" ||
      event.type === "reestablishment" ||
      event.type === "rename"
    ) {
      addRelationship({
        from: [node],
        to: [lastOccurringNodesByCompany.fetch(event.data.oldCompany)],
        type: "predecessor",
      });
    }

    if (event.type === "transfer") {
      addRelationship({
        from: [node],
        to: [
          lastOccurringNodesByCompany.fetch(event.data.parentCompany),
        ],
        type: "parent",
      });
    } else if (event.data.childCompany != null) {
      addRelationship({
        from: [lastOccurringNodesByCompany.fetch(event.data.childCompany)],
        to: [node],
        type: "acquired",
      });
    } else if (event.data.parentCompanies != null) {
      addRelationship({
        from: event.data.parentCompanies.map(parentCompany => {
          return lastOccurringNodesByCompany.fetch(parentCompany);
        }),
        to: [node],
        type: "parent",
      });
    }

    if (event.data.providingCompany != null) {
      addRelationship({
        from: [lastOccurringNodesByCompany.fetch(event.data.providingCompany)],
        to: [node],
        type: "acquired",
      });
    } else if (event.data.receivingCompany != null) {
      addRelationship({
        from: [node],
        to: [
          lastOccurringNodesByCompany.fetch(company),
          lastOccurringNodesByCompany.fetch(event.data.receivingCompany),
        ],
        type: "divesture",
      });
    }

    lastOccurringNodesByCompany.set(company, node);
  });

  //console.log("relationships", relationships);

  return relationships;
}
