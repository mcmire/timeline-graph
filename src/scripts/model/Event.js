export default class Event {
  constructor({ date, company, data, id }) {
    if (date == null) {
      throw new Error(`${this.constructor.name}: No date given`);
    }

    if (company == null) {
      throw new Error(`${this.constructor.name}: No company given`);
    }

    if (data == null) {
      throw new Error(`${this.constructor.name}: No data given`);
    }

    if (id == null) {
      throw new Error(`${this.constructor.name}: No id given`);
    }

    this.date = date;
    this.company = company;
    this.data = data;
    this.id = id;
    this.isHidden = false;

    this.year = date.value.getFullYear();
    this.formattedYear = this.year + (date.isFuzzy ? "(?)" : "");
  }

  get text() {
    return `**${this.formattedYear}**: ` + this.description;
  }

  get attributes() {
    return {
      company: this.company,
      data: this.data,
      date: this.date,
      isHidden: this.isHidden,
    };
  }
}
