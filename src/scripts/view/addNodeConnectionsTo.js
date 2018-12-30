import * as d3 from "d3";
//import _ from "lodash";
import appendCircleTo from "./appendCircleTo";
import appendLinesTo from "./appendLinesTo";
//import IncorporationEvent from "../model/IncorporationEvent";

export default function addNodeConnectionsTo(svg, view) {
  svg
    .append("g")
    .selectAll("g").data(view.relationships).enter().append("g")
    .each((rel, relIndex, elements) => {
      const groupElement = d3.select(elements[relIndex]);

      if (rel.type === "predecessor") {
        appendLinesTo(groupElement, {
          points: [
            { x: rel.from[0].bounds.x2, y: rel.from[0].bounds.halfY },
            { x: rel.to[0].bounds.x1, y: rel.to[0].bounds.halfY },
          ],
        });
      } else if (rel.type === "subsidiary") {
        if (rel.from[0].bounds.y2 <= rel.to[0].bounds.y1) {
          const jut = Math.max(
            (rel.to[0].bounds.x1 - rel.from[0].bounds.x2),
            30
          );
          const x = rel.to[0].bounds.x1 - jut;
          appendLinesTo(groupElement, {
            dashed: true,
            points: [
              { x: rel.from[0].bounds.halfX, y: rel.from[0].bounds.y2 },
              { x: x, y: rel.to[0].bounds.halfY },
            ],
          });
          appendLinesTo(groupElement, {
            points: [
              { x: x, y: rel.to[0].bounds.halfY },
              { x: rel.to[0].bounds.x1, y: rel.to[0].bounds.halfY },
            ],
            withArrowhead: true,
          });
          appendCircleTo(
            groupElement,
            { x: x, y: rel.to[0].bounds.halfY },
          );
        } else {
          const jut = Math.max(
            (rel.to[0].bounds.x1 - rel.from[0].bounds.x2),
            30
          );
          const x = rel.from[0].bounds.x2 + jut;
          appendLinesTo(groupElement, {
            points: [
              { x: rel.from[0].bounds.x2, y: rel.from[0].bounds.halfY },
              { x: x, y: rel.from[0].bounds.halfY },
            ],
          });
          appendLinesTo(groupElement, {
            dashed: true,
            points: [
              { x: x, y: rel.from[0].bounds.halfY },
              { x: rel.to[0].bounds.halfX, y: rel.to[0].bounds.y2 },
            ],
            withArrowhead: true,
          });
          appendCircleTo(
            groupElement,
            { x: x, y: rel.from[0].bounds.halfY },
          );
        }
      } else if (rel.type === "merger" || rel.type === "jointVenture") {
        rel.from.forEach((source, i) => {
          const args = {
            points: [
              { x: source.bounds.x2, y: source.bounds.halfY },
              { x: rel.to[0].bounds.x1 - 30, y: source.bounds.halfY },
            ],
            withArrowhead: false,
          };

          if (i === 0) {
            args.points.push({
              x: rel.to[0].bounds.x1 - 30,
              y: rel.to[0].bounds.halfY,
            });
            args.points.push({
              x: rel.to[0].bounds.x1,
              y: rel.to[0].bounds.halfY,
            });
            args.withArrowhead = true;
          }

          appendLinesTo(groupElement, args);

          appendCircleTo(groupElement, {
            x: rel.to[0].bounds.x1 - 30,
            y: source.bounds.halfY,
          });
        });
      }

      /*
      const jutWidth = rel.from.length > 0 ? 30 : 0;

      const maxXWithJut = _.max(
        rel.from.map(node => node.bounds.x2 + jutWidth)
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
      */
    });
}
