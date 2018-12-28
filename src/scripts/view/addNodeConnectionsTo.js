import * as d3 from "d3";
import _ from "lodash";
import appendCircleTo from "./appendCircleTo";
import appendLinesTo from "./appendLinesTo";
import calculateBounds from "./calculateBounds";
import IncorporationEvent from "../model/IncorporationEvent";

export default function addNodeConnectionsTo(svg, view) {
  const nodesWithParents = view.nodes
    .filter(node => node.parents.length > 0)
    .map(node => {
      return Object.assign(
        Object.create(node),
        {
          bounds: calculateBounds(node),
          parents: node.parents.map(parent => {
            return Object.assign(
              Object.create(parent),
              { bounds: calculateBounds(parent) }
            );
          }),
        }
      );
    });

  svg
    .append("g")
    .selectAll("g").data(nodesWithParents).enter().append("g")
    .each((node, nodeIndex, elements) => {
      const groupElement = d3.select(elements[nodeIndex]);
      const jutWidth = node.parents.length > 0 ? 30 : 0;

      const maxParentXWithJut = _.max(node.parents.map(parent => {
        return parent.bounds.x2 + jutWidth;
      }));

      node.parents.forEach(parent => {
        if (parent.bounds.x2 > node.bounds.x1) {
          if ((node.bounds.x2 - (parent.bounds.x2 + jutWidth)) >= 10) {
            appendLinesTo(groupElement, {
              dashed: (node.event instanceof IncorporationEvent),
              points: [
                {
                  x: parent.bounds.x2,
                  y: parent.bounds.halfY,
                },
                {
                  x: maxParentXWithJut,
                  y: parent.bounds.halfY,
                },
                {
                  x: maxParentXWithJut,
                  y: (
                    parent.bounds.y1 > node.bounds.y1 ?
                      node.bounds.y2 :
                      node.bounds.y1
                  ),
                },
              ],
              withArrowhead: (
                parent.bounds.y1 > node.bounds.y1 ? "up" : "down"
              ),
            });
            appendCircleTo(groupElement, {
              x: maxParentXWithJut,
              y: parent.bounds.halfY,
            });
          } else {
            appendLinesTo(groupElement, {
              dashed: (node.event instanceof IncorporationEvent),
              points: [
                {
                  x: parent.bounds.x2,
                  y: parent.bounds.halfY,
                },
                {
                  x: node.bounds.x2 - ((node.bounds.x2 - parent.bounds.x2) / 2),
                  y: parent.bounds.halfY,
                },
                {
                  x: node.bounds.x2 - ((node.bounds.x2 - parent.bounds.x2) / 2),
                  y: (
                    parent.bounds.y1 > node.bounds.y1 ?
                      node.bounds.y2 :
                      node.bounds.y1
                  ),
                },
              ],
              withArrowhead: (
                parent.bounds.y1 > node.bounds.y1 ? "up" : "down"
              ),
            });
            appendCircleTo(groupElement, {
              x: node.bounds.x2 - ((node.bounds.x2 - parent.bounds.x2) / 2),
              y: parent.bounds.halfY,
            });
          }
        } else {
          /*
          const points = [
            { x: parent.bounds.x2, y: parent.bounds.halfY },
            { x: node.bounds.x1 - jutWidth, y: parent.bounds.halfY },
            { x: node.bounds.x1 - jutWidth, y: node.bounds.halfY },
          ];
          */
          const points = [
            { x: parent.bounds.x2, y: parent.bounds.halfY },
            { x: node.bounds.x1, y: parent.bounds.halfY },
          ];
          let withArrowhead = false;
          /*
          const isLastParent = parentIndex === node.parents.length - 1;

          if (isLastParent) {
            points.push({ x: node.bounds.x1, y: node.bounds.halfY });
            withArrowhead = "right";
          }
          */

          appendLinesTo(groupElement, { points, withArrowhead });

          /*
          appendCircleTo(groupElement, {
            x: node.bounds.x1 - jutWidth,
            y: parent.bounds.halfY,
          });
          */
        }
      });
    });
}
