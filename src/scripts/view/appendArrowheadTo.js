const WIDTH = 4.5;
const HEIGHT = 10;

export default function appendArrowheadTo(element, { x, y, rotation = 0 }) {
  // This faces up with the origin at the tip
  const points = [[x, y], [x - WIDTH, y + HEIGHT], [x + WIDTH, y + HEIGHT]];

  return element
    .append("polygon")
    .attr("fill", "black")
    .attr("points", points.map(point => point.join(",")).join(" "))
    .attr("transform", `rotate(${rotation} ${x} ${y})`);
}
