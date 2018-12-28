import _ from "lodash";
import Company from "./Company";

const entriesSymbol = Symbol("entries");
const lastIndexSymbol = Symbol("lastIndex");

class CompanyCollection {
  constructor({ entries = {}, lastIndex = -1 } = {}) {
    Object.defineProperty(
      this,
      entriesSymbol,
      { enumerable: false, value: entries }
    );
    Object.defineProperty(
      this,
      lastIndexSymbol,
      { enumerable: false, value: lastIndex, writable: true }
    );
  }

  clone() {
    return this.cloneWith({});
  }

  cloneWith({
    entries = _.clone(this[entriesSymbol]),
    lastIndex = this[lastIndexSymbol],
  }) {
    return new this.constructor({ entries, lastIndex });
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
        const newIndex = this[lastIndexSymbol] + 1;
        // console.log("incrementing lastIndex to", newIndex);
        const newCompany = new Company({
          aliases: definiteNames.slice(1),
          index: newIndex,
          name: names[0],
        });
        const newEntries = definiteNames.reduce((entries, name) => {
          return { ...entries, [name]: newCompany };
        }, _.clone(this[entriesSymbol]));
        const newCompanies = this.cloneWith({
          entries: newEntries,
          lastIndex: newIndex,
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

  add(company) {
    const entries = this[entriesSymbol];

    if (this.indexOf(company) === -1) {
      const names = [company.name, ...company.aliases];
      const newEntries = names.reduce((object, name) => {
        return { ...object, [name]: company };
      }, entries);
      return this.cloneWith({ entries: newEntries, lastIndex: company.index });
    } else {
      return this;
    }
  }

  uniq() {
    const companies = _.uniqBy(this.toArray(), "id");
    const entries = _.keyBy(companies, "name");

    return new this.constructor({
      entries: entries,
      lastIndex: companies[companies.length - 1].index,
    });
  }

  toArray() {
    return _.chain(Object.values(this[entriesSymbol]))
      .uniqBy("id")
      .sortBy("index")
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
