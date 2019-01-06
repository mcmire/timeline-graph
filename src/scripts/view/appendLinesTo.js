import appendArrowheadTo from "./appendArrowheadTo";

function normalizePoint(point, { relativeTo: origin }) {
  return {
    x: point.x - origin.x,
    y: point.y - origin.y,
  };
}

function calculateArccosInDegrees({ x, y }) {
  const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return Math.acos(-y / hypotenuse) * (360 / (Math.PI * 2));
}

export default function appendLinesTo(
  element,
  {
    points,
    color = "black",
    dashed = false,
    withArrowhead = false,
  }
) {
  element
    .append("polyline")
    .attr("fill", "none")
    .attr("stroke-width", "1px")
    .attr("stroke", color)
    .attr("stroke-dasharray", dashed ? 4 : null)
    .attr("points", points.map(({x, y}) => [x, y].join(",")).join(" "));

  if (withArrowhead) {
    const lastPoint = points[points.length - 1];
    const normalizedLastPoint = normalizePoint(
      lastPoint,
      { relativeTo: points[points.length - 2] }
    );
    const rotation = calculateArccosInDegrees(normalizedLastPoint);

    appendArrowheadTo(element, { ...lastPoint, rotation });
  }
}
