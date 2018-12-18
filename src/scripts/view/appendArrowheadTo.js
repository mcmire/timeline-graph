export default function appendArrowheadTo(element, { x, y, direction }) {
  const width = 6;
  const height = 10;
  let points;

  if (direction === "down") {
    points = [[x, y], [x + width, y - height], [x - width, y - height]];
  } else if (direction === "up") {
    points = [[x, y], [x - width, y + height], [x + width, y + height]];
  } else if (direction === "right") {
    points = [[x, y], [x - height, y - width], [x - height, y + width]];
  } else {
    throw new Error(`Unknown direction ${direction}.`);
  }

  return element
    .append("polygon")
    .attr("fill", "black")
    .attr("points", points.map(point => point.join(",")).join(" "));
}
