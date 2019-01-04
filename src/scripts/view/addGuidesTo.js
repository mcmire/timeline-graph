import * as d3 from "d3";
import { margin } from "../config";

export default function addGuidesTo(svg, view) {
  const axisColor = d3.hsl(0, 0, 0.85);
  svg
    .append("g")
    .selectAll("line").data(view.nodeGroups).enter().append("line")
    .attr("x1", margin.left)
    .attr("y1", nodeGroup => nodeGroup.y)
    .attr("x2", view.width - margin.right)
    .attr("y2", nodeGroup => nodeGroup.y)
    .attr("stroke", axisColor)
    .attr("stroke-width", "1px")
    .attr("stroke-dasharray", "2");
}
