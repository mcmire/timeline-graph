import Event from "./Event";

export default class ReleaseEvent extends Event {
  get description() {
    return `**${this.company.name}** releases ${this.data.productName}`;
  }
}
