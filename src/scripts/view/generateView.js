import * as d3 from "d3";
import { defaultHeight, margin, verticalSpacing, viewWidth } from "../config";
import _ from "lodash";
import buildMeasuredNodes from "../model/buildMeasuredNodes";
import buildNodeGroups from "../model/buildNodeGroups";
import buildNodes from "../model/buildNodes";
import buildRelationships from "../model/buildRelationships";
import PositionedGraphNode from "./PositionedGraphNode";
import wrapNodes from "../model/wrapNodes";

export default function generateView(model) {
  const nodes = buildNodes(model.events);
  const measuredNodes = buildMeasuredNodes(nodes);
  const measuredNodeGroups = buildNodeGroups(
    model.companies.uniq(),
    measuredNodes,
    buildRelationships(measuredNodes),
  );

  const measuredNodesSortedByEffectiveX = _.sortBy(
    measuredNodes,
    ["event.date.value", "width"],
  );
  const rightmostMeasuredNode =
    measuredNodesSortedByEffectiveX[measuredNodesSortedByEffectiveX.length - 1];
  const virtualXs = measuredNodes.map(node => node.event.date.value);
  const maxX = viewWidth - margin.right - rightmostMeasuredNode.width;
  const mapToX = d3.scaleTime()
    .domain([d3.min(virtualXs), d3.max(virtualXs)])
    .range([margin.left, maxX]);

  const realYsByNodeGroupIndex = measuredNodeGroups.reduce(
    (object, nodeGroup, i) => {
      const nodeGroupHalfHeight = nodeGroup.height / 2;
      let y;

      if (i > 0) {
        y = (
          object[nodeGroup.index - 1] +
          (measuredNodeGroups.at(i - 1).height / 2) +
          verticalSpacing +
          nodeGroupHalfHeight
        );
      } else {
        y = margin.top + nodeGroupHalfHeight;
      }

      return { ...object, [nodeGroup.index]: y };
    },
    {}
  );

  const y2OfLastNode =
    d3.max(Object.values(realYsByNodeGroupIndex)) +
    measuredNodeGroups.last.height;
  const viewHeight = Math.max(
    y2OfLastNode + verticalSpacing + margin.bottom,
    defaultHeight
  );
  const mapToY = (nodeGroupIndex) => {
    if (nodeGroupIndex in realYsByNodeGroupIndex) {
      return realYsByNodeGroupIndex[nodeGroupIndex];
    } else {
      throw new Error(`${nodeGroupIndex} is not a valid node group index`);
    }
  };

  const groupedNodes = _.sortBy(measuredNodeGroups.getAllNodes(), "index");
  const positionedNodes = wrapNodes({
    args: { mapToX, mapToY },
    constructor: PositionedGraphNode,
    nodes: groupedNodes,
  });
  const relationships = buildRelationships(positionedNodes);

  return {
    height: viewHeight,
    mapToX: mapToX,
    mapToY: mapToY,
    nodes: positionedNodes,
    relationships: relationships,
    width: viewWidth,
  };
}
