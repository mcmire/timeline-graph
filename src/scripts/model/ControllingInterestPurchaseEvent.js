import Event from "./Event";

export default class ControllingInterestPurchaseEvent extends Event {
  get description() {
    return (
      `${this.company.name} purchases controlling interest in ` +
      this.data.providingCompany.name
    );
  }
}
