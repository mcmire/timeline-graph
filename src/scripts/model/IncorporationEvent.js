import Event from "./Event";

export default class IncorporationEvent extends Event {
  get description() {
    let description = `**${this.company.name}** founded`;

    if (this.data.founder != null) {
      description += ` by ${this.data.founder}`;
    }

    if (this.data.parentCompany != null) {
      description += ` as subsidiary of ${this.data.parentCompany.name}`;
    }

    return description;
  }
}
