import Event from "./Event";

export default class JointVentureEvent extends Event {
  get description() {
    return `**${this.company.name}** created as joint venture between ` +
      `${this.data.contributors[0].name} and ${this.data.contributors[1].name}`;
  }
}
