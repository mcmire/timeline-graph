import _ from "lodash";
import MeasuredGraphNode from "./MeasuredGraphNode";

export default class PositionedGraphNode extends MeasuredGraphNode {
  constructor({ mapToX, mapToY, ...rest }) {
    super({ ...rest });
    this._mapToX = mapToX;
    this._mapToY = mapToY;
    this._calculate();
  }

  clone() {
    return this.cloneWith({});
  }

  cloneWith({ x = this.x, y = this.y, ...rest }) {
    return super.cloneWith({
      ...rest,
      mapToX: this._mapToX,
      mapToY: this._mapToY,
      x: x,
      y: y
    });
  }

  recalculated() {
    return _.tap(this.clone(), clone => clone._calculate());
  }

  _calculate() {
    this.x = this._mapToX(this.event.date.value);
    this.y = this._mapToY(this.index);
  }
}
