import * as d3 from "d3";
import appendCircleTo from "./appendCircleTo";
import appendLinesTo from "./appendLinesTo";

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
      } else if (rel.type === "parent" || rel.type === "acquired") {
        if (rel.from[0].bounds.y1 > rel.to[0].bounds.y1) {
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
        } else {
          /*
          const jut = Math.max(
            (rel.to[0].bounds.x1 - rel.from[0].bounds.x2),
            30
          );
          */
          const jut = 30;
          const x = rel.to[0].bounds.x1 - jut;

          appendLinesTo(groupElement, {
            points: [
              { x: rel.from[0].bounds.halfX, y: rel.from[0].bounds.halfY },
              { x: x - jut, y: rel.from[0].bounds.halfY },
            ],
          });
          appendLinesTo(groupElement, {
            dashed: true,
            points: [
              //{ x: rel.from[0].bounds.halfX, y: rel.from[0].bounds.y2 },
              { x: x - jut, y: rel.from[0].bounds.halfY },
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
            //{ x: x, y: rel.to[0].bounds.halfY },
            { x: x - 30, y: rel.from[0].bounds.halfY },
          );
        }
      } else if (rel.type === "source") {
        const jut = 30;

        rel.from.forEach((source, i) => {
          if (source.bounds.y2 >= rel.to[0].bounds.y2) {
            const args = {
              points: [
                { x: source.bounds.x2, y: source.bounds.halfY },
                { x: rel.to[0].bounds.x1 - jut, y: source.bounds.halfY },
                { x: rel.to[0].bounds.x1 - jut, y: rel.to[0].bounds.halfY },
              ],
              withArrowhead: false,
            };
            appendLinesTo(groupElement, args);

            appendCircleTo(
              groupElement,
              { x: rel.to[0].bounds.x1 - jut, y: source.bounds.halfY },
            );
          } else {
            const args = {
              points: [
                { x: source.bounds.x2, y: source.bounds.halfY },
                { x: rel.to[0].bounds.x1 - jut, y: source.bounds.halfY },
              ],
              withArrowhead: false,
            };

            if (i === 0) {
              args.points.push({
                x: rel.to[0].bounds.x1 - jut,
                y: rel.to[0].bounds.halfY,
              });
              args.points.push({
                x: rel.to[0].bounds.x1,
                y: rel.to[0].bounds.halfY,
              });
              args.withArrowhead = true;
            }

            appendLinesTo(groupElement, args);

            appendCircleTo(
              groupElement,
              { x: rel.to[0].bounds.x1 - jut, y: source.bounds.halfY }
            );
          }
        });
      }
    });
}
