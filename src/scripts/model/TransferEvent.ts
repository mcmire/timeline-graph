import Event from "./Event";

export default class TransferEvent extends Event {
  get description() {
    return `${this.company.name} re-established as **${this.data.newCompany.name}**, subsidiary of ${this.data.parentCompany.name}`;
  }
}
