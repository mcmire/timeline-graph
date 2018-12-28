import nanoid from "nanoid";

export default class Company {
  constructor({ index, name, aliases }) {
    if (index == null) {
      throw new Error(`${this.constructor.name}: No index given`);
    }

    if (name == null) {
      throw new Error(`${this.constructor.name}: No name given`);
    }

    if (aliases == null) {
      throw new Error(`${this.constructor.name}: No aliases given`);
    }

    this.index = index;
    this.name = name;
    this.aliases = aliases;

    this.id = nanoid();
  }

  get attributes() {
    return {
      aliases: this.aliases,
      id: this.id,
      index: this.index,
      name: this.name,
    };
  }
}
