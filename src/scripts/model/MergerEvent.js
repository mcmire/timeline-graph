import Event from "./Event";

export default class MergerEvent extends Event {
  get description() {
    if (this.data.sources.length > 1) {
      return `${this.data.sources[0].name} and ${this.data.sources[1].name} ` +
        `merge to become **${this.company.name}**`;
    } else {
      return `${this.data.sources[0].name} and a competing company ` +
        `merge to become **${this.company.name}**`;
    }
  }
}
