import Event from "./Event";

export default class HiddenEvent extends Event {
  constructor(...args) {
    super(...args);

    this.isHidden = true;
  }
}
