import appendArrowheadTo from "./appendArrowheadTo";

export default function appendLinesTo(
  element,
  { points, dashed = false, withArrowhead = false }
) {
  element
    .append("polyline")
    .attr("fill", "none")
    .attr("stroke-width", "1px")
    .attr("stroke", "black")
    .attr("stroke-dasharray", dashed ? 4 : null)
    .attr("points", points.map(({x, y}) => [x, y].join(",")).join(" "));

  if (withArrowhead) {
    const { x, y } = points[points.length - 1];
    appendArrowheadTo(element, { x, y, direction: withArrowhead });
  }
}
