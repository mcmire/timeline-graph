import MeasuredGraphNode from "./MeasuredGraphNode";

export default class GroupedNode extends MeasuredGraphNode {
  constructor({ nodeGroupIndex, ...rest }) {
    super({ ...rest });
    this.nodeGroupIndex = nodeGroupIndex;
  }

  clone() {
    return this.cloneWith({});
  }

  cloneWith({ nodeGroupIndex = this.nodeGroupIndex, ...rest }) {
    return super.cloneWith({ ...rest, nodeGroupIndex });
  }
}
