import Event from "./Event";

export default class FormationEvent extends Event {
  get description() {
    return `**${this.company.name}** created as a division of ` +
      `${this.data.parentCompanies[0].name}`;
  }
}
