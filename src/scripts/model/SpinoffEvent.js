import Event from "./Event";

export default class SpinoffEvent extends Event {
  get description() {
    return `**${this.company.name}** spun off from ` +
      `${this.data.parentCompany.name}`;
  }
}
