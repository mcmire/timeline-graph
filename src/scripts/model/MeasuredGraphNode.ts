import GraphNode from "./GraphNode";

export default class MeasuredGraphNode extends GraphNode {
  constructor({ lines, width, height, ...rest }) {
    super({ ...rest });
    this.lines = lines;
    this.width = width;
    this.height = height;
  }

  cloneWith({
    lines = this.lines,
    width = this.width,
    height = this.height,
    ...rest
  }) {
    return super.cloneWith({ ...rest, lines, width, height });
  }
}
