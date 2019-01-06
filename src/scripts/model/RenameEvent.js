import Event from "./Event";

export default class RenameEvent extends Event {
  get description() {
    return `${this.data.oldCompany.name} is bought out, becoming ` +
      `**${this.company.name}** `;
  }
}
