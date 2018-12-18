import _ from "lodash";
import * as d3 from "d3";
import { margin, verticalSpacing, viewWidth, defaultHeight } from "../config";
import reindexNodes from "../model/reindexNodes";
import buildNodeGraph from "../model/buildNodeGraph";
import buildMeasuredNodes from "../model/buildMeasuredNodes";
import buildNodes from "../model/buildNodes";
import PositionedGraphNode from "../model/PositionedGraphNode";

export default function generateView(model) {
  const measuredNodes = reindexNodes(
    buildNodeGraph(
      buildMeasuredNodes(
        buildNodes(model.events)
      )
    )
  );

  // console.log("events", events);
  // console.log("measuredNodes", measuredNodes);

  // const sumOfWidths = _.sumBy(measuredNodes, "width");

  const virtualXs = measuredNodes.map(node => node.event.date.value);
  const maxX =
    viewWidth -
    margin.right -
    measuredNodes[measuredNodes.length - 1].width;
  const mapToX = d3.scaleTime()
    .domain([d3.min(virtualXs), d3.max(virtualXs)])
    .range([margin.left, maxX]);

  const sortedMeasuredNodes = _.sortBy(measuredNodes, "index");
  const realYsByNodeIndex = sortedMeasuredNodes.reduce(
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

  const y2OfLastNode =
    d3.max(Object.values(realYsByNodeIndex)) +
    sortedMeasuredNodes[sortedMeasuredNodes.length - 1].height;
  const viewHeight = Math.max(
    y2OfLastNode + verticalSpacing + margin.bottom,
    defaultHeight
  );
  const mapToY = (index) => realYsByNodeIndex[index];

  const { positionedNodes } = measuredNodes.reduce(
    (results, node) => {
      const positionedNode = new PositionedGraphNode({
        ...node,
        mapToX,
        mapToY,
        parents: node.parents.map(parent => {
          return results.positionedNodesById[parent.id];
        }),
      });

      return {
        positionedNodes: results.positionedNodes.concat([positionedNode]),
        positionedNodesById: {
          ...results.positionedNodesById,
          [node.id]: positionedNode,
        },
      };
    },
    { positionedNodes: [], positionedNodesById: {} }
  );

  return {
    width: viewWidth,
    height: viewHeight,
    mapToX: mapToX,
    mapToY: mapToY,
    nodes: positionedNodes,
  };
}
