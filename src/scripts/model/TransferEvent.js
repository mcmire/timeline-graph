import Event from "./Event";

export default class TransferEvent extends Event {
  get description() {
    return `${this.data.oldCompany.name} re-established as ` +
      `**${this.company.name}**, subsidiary of ` +
      `${this.data.parentCompany.name}`;
  }
}
