import Event from "./Event";

export default class TransferEvent extends Event {
  get description() {
    return (
      `${this.company.name} transferred to ` +
      `${this.data.parentCompany.name} as a subsidiary`
    );
  }
}
