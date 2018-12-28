import _ from "lodash";
import Company from "./Company";

const entriesSymbol = Symbol("entries");
const lastIdSymbol = Symbol("lastId");

class CompanyCollection {
  constructor({ entries = {}, lastId = -1 } = {}) {
    Object.defineProperty(
      this,
      entriesSymbol,
      { value: entries, enumerable: false }
    );
    Object.defineProperty(
      this,
      lastIdSymbol,
      { value: lastId, enumerable: false, writable: true }
    );
  }

  clone() {
    return this.cloneWith({});
  }

  cloneWith({
    entries = _.clone(this[entriesSymbol]),
    lastId = this[lastIdSymbol],
  }) {
    return new this.constructor({ entries, lastId });
  }

  size() {
    return Object.keys(this[entriesSymbol]).length;
  }

  map(fn) {
    return this.toArray().map(fn);
  }

  reduce(fn, acc) {
    return this.toArray().reduce(fn, acc);
  }

  merge(companyCollection) {
    const newCompanyCollection = this.constructor.wrap(companyCollection);

    return _.reduce(
      newCompanyCollection[entriesSymbol],
      (newCompanies, company) => newCompanies.add(company),
      this.clone()
    );
  }

  find(...names) {
    const definiteNames = names.filter(name => name != null);

    if (definiteNames.length > 0) {
      const possibleCompanies = definiteNames.map(name => {
        return this[entriesSymbol][name];
      });
      const foundCompany = possibleCompanies.find(company => company != null);

      if (foundCompany == null) {
        throw new Error(
          `No such company exists: ${names.join(" / ")}. ` +
          "Maybe your events are listed in the wrong order?"
        );
      } else {
        return foundCompany;
      }
    } else {
      throw new Error("Must provide a name to find a company!");
    }
  }

  findOrCreate(...names) {
    const definiteNames = names.filter(name => name != null);

    if (definiteNames.length > 0) {
      const possibleCompanies = definiteNames.map(name => {
        return this[entriesSymbol][name];
      });
      const foundCompany = possibleCompanies.find(company => company != null);

      if (foundCompany == null) {
        const newId = this[lastIdSymbol] + 1;
        // console.log("incrementing lastId to", newId);
        const newCompany = new Company({
          id: newId,
          name: names[0],
          aliases: names.slice(1),
        });
        const newEntries = names.reduce((entries, name) => {
          return { ...entries, [name]: newCompany };
        }, _.clone(this[entriesSymbol]));
        const newCompanies = this.cloneWith({
          entries: newEntries,
          lastId: newId,
        });
        return [newCompanies, newCompany];
      } else {
        return [this, foundCompany];
      }
    } else {
      return [this, null];
    }
  }

  indexOf(company) {
    return _.findIndex(Object.values(this[entriesSymbol]), c => {
      return c.id === company.id;
    });
  }

  add({ name, aliases }) {
    return this.findOrCreate(name, ...aliases)[0];
  }

  toArray() {
    return _.chain(Object.values(this[entriesSymbol]))
      .uniqBy("id")
      .sortBy("id")
      .value();
  }
}

CompanyCollection.wrap = function (value) {
  if (value instanceof this) {
    return value;
  } else {
    return new this({ entries: value });
  }
};

export default CompanyCollection;
