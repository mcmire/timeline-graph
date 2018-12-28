import * as d3 from "d3";
import { defaultHeight, margin, verticalSpacing, viewWidth } from "../config";
import _ from "lodash";
import buildMeasuredNodes from "../model/buildMeasuredNodes";
import buildNodeGraph from "../model/buildNodeGraph";
import buildNodeGroups from "../model/buildNodeGroups";
import buildNodes from "../model/buildNodes";
import PositionedGraphNode from "../model/PositionedGraphNode";
import wrapNodes from "../model/wrapNodes";
//import reindexNodes from "../model/reindexNodes";

export default function generateView(model) {
  /*
  const measuredNodes = reindexNodes(
    buildNodeGraph(
      buildMeasuredNodes(
        buildNodes(model.events)
      )
    )
  );
  */
  const originalNodes = buildNodeGraph(buildMeasuredNodes(buildNodes(model.events)));
  //console.log("originalNodes", originalNodes);
  const measuredNodeGroups = buildNodeGroups(
    model.companies,
    originalNodes
  );
  const measuredNodes = measuredNodeGroups.getAllNodes();
  console.log("measuredNodes", measuredNodes);

  /*
  const virtualXs = measuredNodes.map(node => node.event.date.value);
  const maxX =
    viewWidth -
    margin.right -
    measuredNodes[measuredNodes.length - 1].width;
  const mapToX = d3.scaleTime()
    .domain([d3.min(virtualXs), d3.max(virtualXs)])
    .range([margin.left, maxX]);
  */
  const measuredNodesSortedByDate = _.sortBy(measuredNodes, "event.date.value");
  const virtualXs = measuredNodes.map(node => node.event.date.value);
  const maxX =
    viewWidth -
    margin.right -
    measuredNodesSortedByDate[measuredNodesSortedByDate.length - 1].width;
  const mapToX = d3.scaleTime()
    .domain([d3.min(virtualXs), d3.max(virtualXs)])
    .range([margin.left, maxX]);

  /*
  const sortedMeasuredNodes = _.sortBy(measuredNodes, "index");
  const realYsByNodeGroupIndex = sortedMeasuredNodes.reduce(
    (object, node) => {
      let y;

      if (node.index > 0) {
        y = (
          object[node.index - 1] +
          sortedMeasuredNodes[node.index - 1].height +
          verticalSpacing
        );
      } else {
        y = margin.top;
      }

      return { ...object, [node.index]: y };
    },
    {},
  );
  */
  const realYsByNodeGroupIndex = measuredNodeGroups.reduce(
    (array, nodeGroup, i) => {
      const nodeGroupHeight = nodeGroup.height / 2;
      let y;

      if (i > 0) {
        y = (
          array[i - 1] +
          (measuredNodeGroups.at(i - 1).height / 2) +
          verticalSpacing +
          nodeGroupHeight
        );
      } else {
        y = margin.top + nodeGroupHeight;
      }

      return array.concat([y]);
    },
    []
  );

  const y2OfLastNode =
    d3.max(Object.values(realYsByNodeGroupIndex)) +
    measuredNodeGroups.last.height;
  const viewHeight = Math.max(
    y2OfLastNode + verticalSpacing + margin.bottom,
    defaultHeight
  );
  const mapToY = (nodeGroupIndex) => realYsByNodeGroupIndex[nodeGroupIndex];

  const positionedNodes = wrapNodes({
    args: { mapToX, mapToY },
    constructor: PositionedGraphNode,
    nodes: measuredNodes,
  });
  //console.log("positionedNodes", positionedNodes);

  return {
    height: viewHeight,
    mapToX: mapToX,
    mapToY: mapToY,
    nodes: positionedNodes,
    width: viewWidth,
  };
}
