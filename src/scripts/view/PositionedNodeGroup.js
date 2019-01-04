import NodeGroup from "../model/NodeGroup";

export default class PositionedNodeGroup extends NodeGroup {
  constructor({ y, ...rest }) {
    super({ ...rest });
    this.y = y;
  }

  cloneWith({ y = this.y, ...rest }) {
    return super.cloneWith({ y, ...rest });
  }
}
