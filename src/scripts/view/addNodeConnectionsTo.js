import * as d3 from "d3";
import _ from "lodash";
import appendCircleTo from "./appendCircleTo";
import appendLinesTo from "./appendLinesTo";

function addPredecessorConnectionsTo(groupElement, rel) {
  appendLinesTo(groupElement, {
    points: [
      { x: rel.from[0].bounds.x2, y: rel.from[0].bounds.halfY },
      { x: rel.to[0].bounds.x1, y: rel.to[0].bounds.halfY },
    ],
  });
}

function addParentConnectionsTo(groupElement, rel) {
  rel.from.forEach(from => {
    if (from.bounds.y1 > rel.to[0].bounds.y1) {
      if (rel.to[0].bounds.halfX < (from.bounds.x2 + 30)) {
        appendLinesTo(groupElement, {
          dashed: true,
          points: [
            { x: from.bounds.halfX, y: from.bounds.y1 },
            { x: rel.to[0].bounds.halfX, y: rel.to[0].bounds.y2 },
          ],
          withArrowhead: true,
        });
        appendCircleTo(
          groupElement,
          { x: from.bounds.halfX, y: from.bounds.y1 },
        );
      } else {
        const jut = Math.max(
          (rel.to[0].bounds.x1 - from.bounds.x2),
          30
        );
        const x = from.bounds.x2 + jut;
        appendLinesTo(groupElement, {
          points: [
            { x: from.bounds.x2, y: from.bounds.halfY },
            { x: x, y: from.bounds.halfY },
          ],
        });
        appendLinesTo(groupElement, {
          dashed: true,
          points: [
            { x: x, y: from.bounds.halfY },
            { x: rel.to[0].bounds.halfX, y: rel.to[0].bounds.y2 },
          ],
          withArrowhead: true,
        });
        appendCircleTo(
          groupElement,
          { x: x, y: from.bounds.halfY },
        );
      }
    /*
    } else if (from.bounds.x1 > rel.to[0].bounds.x2) {
      appendLinesTo(groupElement, {
        dashed: true,
        points: [
          { x: from.bounds.halfX, y: from.bounds.y2 },
          { x: from.bounds.halfX + 30, y: rel.to[0].bounds.halfY },
        ],
        withArrowhead: true,
      });
    */
    } else if (from.bounds.x2 > (rel.to[0].bounds.x2 - 30)) {
      appendLinesTo(groupElement, {
        dashed: true,
        points: [
          { x: from.bounds.halfX, y: from.bounds.y2 },
          { x: rel.to[0].bounds.halfX, y: rel.to[0].bounds.y1 },
        ],
        withArrowhead: true,
      });
    } else if (from.bounds.x2 > rel.to[0].bounds.x1) {
      const jut = 30;
      const x = Math.min(
        from.bounds.x2 + jut,
        (
          from.bounds.x2 +
          ((rel.to[0].bounds.x2 - from.bounds.x2) / 2)
        )
      );
      appendCircleTo(
        groupElement,
        { x: x, y: from.bounds.halfY },
      );
      /*
            appendLinesTo(groupElement, {
              dashed: true,
              points: [
                { x: from.bounds.halfX, y: from.bounds.y2 },
                { x: rel.to[0].bounds.halfX, y: rel.to[0].bounds.y1 },
              ],
              withArrowhead: true,
            });
            */
      appendLinesTo(groupElement, {
        points: [
          { x: from.bounds.x2, y: from.bounds.halfY },
          { x: x, y: from.bounds.halfY },
        ],
      });
      appendLinesTo(groupElement, {
        dashed: true,
        points: [
          { x: x, y: from.bounds.halfY },
          { x: x, y: rel.to[0].bounds.y1 },
        ],
        withArrowhead: true,
      });
    } else {
      /*
      appendLinesTo(groupElement, {
        points: [
          { x: from.bounds.x2, y: from.bounds.halfY },
          { x: rel.to[0].bounds.halfX - 30, y: from.bounds.halfY },
        ],
      });
      appendCircleTo(
        groupElement,
        { x: rel.to[0].bounds.halfX - 30, y: from.bounds.halfY },
      );
      appendLinesTo(groupElement, {
        dashed: true,
        points: [
          { x: rel.to[0].bounds.halfX - 30, y: from.bounds.halfY },
          { x: rel.to[0].bounds.halfX, y: rel.to[0].bounds.y1 },
        ],
        withArrowhead: true,
      });
      */

      const jut = 30;
      const x = rel.to[0].bounds.halfX - jut;

      appendLinesTo(groupElement, {
        points: [
          { x: from.bounds.x2, y: from.bounds.halfY },
          { x: x, y: from.bounds.halfY },
        ],
      });
      appendLinesTo(groupElement, {
        dashed: true,
        points: [
          { x: x, y: from.bounds.halfY },
          { x: rel.to[0].bounds.halfX, y: rel.to[0].bounds.y1 },
        ],
        withArrowhead: true,
      });
      /*
      appendLinesTo(groupElement, {
        points: [
          { x: x, y: rel.to[0].bounds.halfY },
          { x: rel.to[0].bounds.x1, y: rel.to[0].bounds.halfY },
        ],
        withArrowhead: true,
      });
      */
      appendCircleTo(
        groupElement,
        { x: x, y: from.bounds.halfY },
      );
    }
  });
}

function addSourceConnectionsTo(groupElement, rel) {
  const jut = 30;
  const originateFromX2 = rel.from.some(source => {
    return source.bounds.x2 > (rel.to[0].bounds.x1 - jut);
  });
  const maxX = _.max(
    rel.from.map(source => {
      if (source.bounds.x2 > rel.to[0].bounds.halfX) {
        return Math.min(
          source.bounds.x2 + jut,
          (
            source.bounds.x2 +
            ((rel.to[0].bounds.x2 - source.bounds.x2) / 2)
          )
        );
      } else {
        return rel.to[0].bounds.halfX;
      }
    })
  );

  rel.from.forEach((source, i) => {
    if (source.bounds.y2 >= rel.to[0].bounds.y2) {
      if (originateFromX2) {
        appendLinesTo(groupElement, {
          points: [
            { x: source.bounds.x2, y: source.bounds.halfY },
            { x: maxX, y: source.bounds.halfY },
            { x: maxX, y: rel.to[0].bounds.y2 },
          ],
          withArrowhead: true,
        });
      } else {
        const args = {
          points: [
            { x: source.bounds.x2, y: source.bounds.halfY },
            { x: rel.to[0].bounds.x1 - jut, y: source.bounds.halfY },
            { x: rel.to[0].bounds.x1 - jut, y: rel.to[0].bounds.halfY },
          ],
        };
        appendLinesTo(groupElement, args);

        appendCircleTo(
          groupElement,
          { x: rel.to[0].bounds.x1 - jut, y: source.bounds.halfY },
        );
      }
    } else {
      /* eslint no-lonely-if: off */
      if (originateFromX2) {
        appendLinesTo(groupElement, {
          points: [
            { x: source.bounds.x2, y: source.bounds.halfY },
            { x: maxX, y: source.bounds.halfY },
            { x: maxX, y: rel.to[0].bounds.y1 },
          ],
          withArrowhead: true,
        });
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
    }
  });
}

function addDivestitureConnectionsTo(groupElement, rel) {
  const [companyNode, receivingCompanyNode] = rel.to;
  appendLinesTo(groupElement, {
    dashed: true,
    points: [
      {
        x: rel.from[0].bounds.halfX,
        y: rel.from[0].bounds.y1,
      },
      {
        x: rel.from[0].bounds.halfX + 30,
        y: receivingCompanyNode.bounds.halfY,
      },
    ],
    withArrowhead: true,
  });
  appendCircleTo(
    groupElement,
    {
      x: rel.from[0].bounds.halfX + 30,
      y: receivingCompanyNode.bounds.halfY,
    },
  );
  appendLinesTo(groupElement, {
    points: [
      {
        x: rel.from[0].bounds.halfX + 30,
        y: receivingCompanyNode.bounds.halfY,
      },
      {
        x: companyNode.bounds.halfX - 30,
        y: receivingCompanyNode.bounds.halfY,
      },
    ],
  });
}

export default function addNodeConnectionsTo(svg, view) {
  svg
    .append("g")
    .selectAll("g").data(view.relationships).enter().append("g")
    .each((rel, relIndex, elements) => {
      const groupElement = d3.select(elements[relIndex]);

      if (rel.type === "predecessor") {
        addPredecessorConnectionsTo(groupElement, rel);
      } else if (rel.type === "parent" || rel.type === "acquired") {
        addParentConnectionsTo(groupElement, rel);
      } else if (rel.type === "source") {
        addSourceConnectionsTo(groupElement, rel);
      } else if (rel.type === "divesture") {
        addDivestitureConnectionsTo(groupElement, rel);
      }
    });
}
