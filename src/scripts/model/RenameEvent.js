import Event from "./Event";

export default class RenameEvent extends Event {
  get description() {
    return `${this.data.oldCompany.name} renamed to **${this.company.name}**`;
  }
}
