import _ from "lodash";
import calculateBounds from "./calculateBounds";
import GroupedNode from "../model/GroupedNode";

export default class PositionedGraphNode extends GroupedNode {
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
      y: y,
    });
  }

  recalculated() {
    return _.tap(this.clone(), clone => clone._calculate());
  }

  _calculate() {
    this.x = this._mapToX(this.event.date.value);
    this.y = this._mapToY(this.nodeGroupIndex);
    this.adjustedY = this.y - this.halfHeight;
    this.bounds = calculateBounds(this);
  }
}
