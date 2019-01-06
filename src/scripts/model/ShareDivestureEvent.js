import Event from "./Event";

export default class ShareDivestureEvent extends Event {
  get description() {
    return (
      `**${this.company.name}** divests shares of ` +
      this.data.receivingCompany.name
    );
  }
}
