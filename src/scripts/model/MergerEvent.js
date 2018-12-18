import Event from "./Event";

export default class MergerEvent extends Event {
  get description() {
    return `${this.data.sources[0].name} and ${this.data.sources[1].name} ` +
      `merge to become **${this.company.name}**`;
  }
}
