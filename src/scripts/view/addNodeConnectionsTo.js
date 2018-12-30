import * as d3 from "d3";
import _ from "lodash";
import appendCircleTo from "./appendCircleTo";
import appendLinesTo from "./appendLinesTo";
import IncorporationEvent from "../model/IncorporationEvent";

export default function addNodeConnectionsTo(svg, view) {
  const nodesWithRelationships = view.nodes.filter(node => {
    return node.relationships.length > 0;
  });

  svg
    .append("g")
    .selectAll("g").data(nodesWithRelationships).enter().append("g")
    .each((node, nodeIndex, elements) => {
      const groupElement = d3.select(elements[nodeIndex]);
      const jutWidth = node.relationships.length > 0 ? 30 : 0;

      const maxXWithJut = _.max(
        node.relationships.map(relationship => {
          return relationship.node.bounds.x2 + jutWidth;
        })
      );

      node.relationships.forEach((relationship, relationshipIndex) => {
        if (relationship.node.bounds.x1 === node.bounds.x1 && node.event.isHidden) {
          const y = (
            node.bounds.y1 < relationship.node.bounds.y1 ?
              relationship.node.bounds.y1 :
              relationship.node.bounds.y2
          );
          appendLinesTo(groupElement, {
            dashed: true,
            points: [
              {
                x: node.bounds.x1,
                y: node.bounds.halfY,
              },
              {
                x: relationship.node.bounds.halfX,
                y: y,
              },
            ],
            withArrowhead: true,
          });
        } else if (relationship.node.bounds.x2 > node.bounds.x1) {
          if ((node.bounds.x2 - (relationship.node.bounds.x2 + jutWidth)) >= 10) {
            appendLinesTo(groupElement, {
              dashed: (node.event instanceof IncorporationEvent),
              points: [
                {
                  x: relationship.node.bounds.x2,
                  y: relationship.node.bounds.halfY,
                },
                {
                  x: maxXWithJut,
                  y: relationship.node.bounds.halfY,
                },
                {
                  x: maxXWithJut,
                  y: (
                    relationship.node.bounds.y1 > node.bounds.y1 ?
                      node.bounds.y2 :
                      node.bounds.y1
                  ),
                },
              ],
              withArrowhead: (
                relationship.node.bounds.y1 > node.bounds.y1 ? "up" : "down"
              ),
            });
            appendCircleTo(groupElement, {
              x: maxXWithJut,
              y: relationship.node.bounds.halfY,
            });
          } else {
            appendLinesTo(groupElement, {
              dashed: (node.event instanceof IncorporationEvent),
              points: [
                {
                  x: relationship.node.bounds.x2,
                  y: relationship.node.bounds.halfY,
                },
                {
                  x: node.bounds.x2 - ((node.bounds.x2 - relationship.node.bounds.x2) / 2),
                  y: relationship.node.bounds.halfY,
                },
                {
                  x: node.bounds.x2 - ((node.bounds.x2 - relationship.node.bounds.x2) / 2),
                  y: (
                    relationship.node.bounds.y1 > node.bounds.y1 ?
                      node.bounds.y2 :
                      node.bounds.y1
                  ),
                },
              ],
              withArrowhead: (
                relationship.node.bounds.y1 > node.bounds.y1 ? "up" : "down"
              ),
            });
            appendCircleTo(groupElement, {
              x: node.bounds.x2 - ((node.bounds.x2 - relationship.node.bounds.x2) / 2),
              y: relationship.node.bounds.halfY,
            });
          }
        } else if (node.event.isHidden) {
          appendCircleTo(groupElement, {
            x: node.bounds.x1,
            y: node.bounds.halfY,
          });
          appendLinesTo(groupElement, {
            points: [
              { x: node.bounds.x1, y: node.bounds.halfY },
              { x: relationship.node.bounds.x2, y: relationship.node.bounds.halfY },
            ],
          });
        } else if ((node.bounds.x1 - jutWidth) < relationship.node.bounds.x2) {
          const points = [
            { x: relationship.node.bounds.x2, y: relationship.node.bounds.halfY },
            { x: maxXWithJut, y: relationship.node.bounds.halfY },
            { x: maxXWithJut, y: node.bounds.y1 },
          ];

          appendLinesTo(groupElement, { points, withArrowhead: true });
          appendCircleTo(groupElement, {
            x: maxXWithJut,
            y: relationship.node.bounds.halfY,
          });
        } else {
          const points = [
            { x: relationship.node.bounds.x2, y: relationship.node.bounds.halfY },
            { x: node.bounds.x1 - jutWidth, y: relationship.node.bounds.halfY },
            { x: node.bounds.x1 - jutWidth, y: node.bounds.halfY },
          ];
          const isLastParent =
            relationshipIndex === node.relationships.length - 1;

          let withArrowhead = false;
          if (isLastParent) {
            points.push({ x: node.bounds.x1, y: node.bounds.halfY });
            withArrowhead = "right";
          }
          appendLinesTo(groupElement, { points, withArrowhead });

          if (node.relationships.length > 1) {
            appendCircleTo(groupElement, {
              x: node.bounds.x1 - jutWidth,
              y: relationship.node.bounds.halfY,
            });
          }
        }
      });
    });
}
