import _ from "lodash";
import * as d3 from "d3";
import calculateBounds from "./calculateBounds";
import appendLinesTo from "./appendLinesTo";
import appendCircleTo from "./appendCircleTo";
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
          })
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

      node.parents.forEach((parent, parentIndex) => {
        if (parent.bounds.x2 > node.bounds.x1) {
          if ((node.bounds.x2 - (parent.bounds.x2 + jutWidth)) >= 10) {
            appendLinesTo(groupElement, {
              points: [
                {
                  x: parent.bounds.x2,
                  y: parent.bounds.halfY
                },
                {
                  x: maxParentXWithJut,
                  y: parent.bounds.halfY
                },
                {
                  x: maxParentXWithJut,
                  y: (
                    parent.bounds.y1 > node.bounds.y1 ? node.bounds.y2 : node.bounds.y1
                  )
                }
              ],
              dashed: (node.event instanceof IncorporationEvent),
              withArrowhead: (parent.bounds.y1 > node.bounds.y1 ? "up" : "down")
            });
            appendCircleTo(groupElement, {
              x: maxParentXWithJut,
              y: parent.bounds.halfY
            });
          } else {
            appendLinesTo(groupElement, {
              points: [
                {
                  x: parent.bounds.x2,
                  y: parent.bounds.halfY
                },
                {
                  x: node.bounds.x2 - ((node.bounds.x2 - parent.bounds.x2) / 2),
                  y: parent.bounds.halfY
                },
                {
                  x: node.bounds.x2 - ((node.bounds.x2 - parent.bounds.x2) / 2),
                  y: (
                    parent.bounds.y1 > node.bounds.y1 ? node.bounds.y2 : node.bounds.y1
                  )
                }
              ],
              dashed: (node.event instanceof IncorporationEvent),
              withArrowhead: (parent.bounds.y1 > node.bounds.y1 ? "up" : "down")
            });
            appendCircleTo(groupElement, {
              x: node.bounds.x2 - ((node.bounds.x2 - parent.bounds.x2) / 2),
              y: parent.bounds.halfY
            });
          }
        } else {
          const points = [
            { x: parent.bounds.x2, y: parent.bounds.halfY },
            { x: node.bounds.x1 - jutWidth, y: parent.bounds.halfY },
            { x: node.bounds.x1 - jutWidth, y: node.bounds.halfY }
          ];
          let withArrowhead = false;

          if (parentIndex === node.parents.length - 1) {
            points.push({ x: node.bounds.x1, y: node.bounds.halfY });
            withArrowhead = "right";
          }

          appendLinesTo(groupElement, { points, withArrowhead });

          appendCircleTo(groupElement, {
            x: node.bounds.x1 - jutWidth,
            y: parent.bounds.halfY
          });
        }
      });
    });
}
