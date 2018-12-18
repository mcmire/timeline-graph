export default function appendCircleTo(element, { x, y }) {
  return element
    .append("circle")
    .attr("fill", "black")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 3);
}
