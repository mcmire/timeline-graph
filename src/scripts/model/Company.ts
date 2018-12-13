export default class Company {
  constructor({ id, name, aliases }) {
    if (id == null) {
      throw `${this.constructor.name}: No id given`;
    }

    if (name == null) {
      throw `${this.constructor.name}: No name given`;
    }

    if (aliases == null) {
      throw `${this.constructor.name}: No aliases given`;
    }

    this.id = id;
    this.name = name;
    this.aliases = aliases;
  }

  get attributes() {
    return {
      id: this.id,
      name: this.name,
      aliases: this.aliases
    };
  }
}
