import Event from "./Event";

export default class AcquisitionEvent extends Event {
  get description() {
    return `${this.company.name} acquires ${this.data.childCompany.name}`;
  }
}
