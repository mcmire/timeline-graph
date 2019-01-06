export default function appendCircleTo(
  element,
  { x, y },
  { color = "black" } = {}
) {
  return element
    .append("circle")
    .attr("fill", color)
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 3);
}
