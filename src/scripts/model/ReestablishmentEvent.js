import Event from "./Event";

export default class ReestablishmentEvent extends Event {
  get description() {
    let description = `${this.data.oldCompany.name} re-established as ` +
      `**${this.company.name}**, `;

    if (this.data.parentCompanies.length > 1) {
      description += "joint venture between " +
        `${this.data.parentCompanies[0].name} and ` +
        `${this.data.parentCompanies[1].name}`;
    } else {
      description += `subsidiary of ${this.data.parentCompanies[0].name}`;
    }

    return description;
  }
}
