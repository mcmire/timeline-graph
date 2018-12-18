export default class Event {
  constructor({ date, company, data, id }) {
    if (date == null) {
      throw `${this.constructor.name}: No date given`;
    }

    if (company == null) {
      throw `${this.constructor.name}: No company given`;
    }

    if (data == null) {
      throw `${this.constructor.name}: No data given`;
    }

    if (id == null) {
      throw `${this.constructor.name}: No id given`;
    }

    this.date = date;
    this.company = company;
    this.data = data;
    this.id = id;

    this.year = date.value.getFullYear();
    this.formattedYear = this.year + (date.isFuzzy ? "(?)" : "");
  }

  get text() {
    return `**${this.formattedYear}**: ` + this.description;
  }

  get attributes() {
    return {
      date: this.date,
      company: this.company,
      data: this.data,
    };
  }
}
