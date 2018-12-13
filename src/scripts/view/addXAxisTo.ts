import * as d3 from "d3";
import { margin } from "../config";

export default function addXAxisTo(svg, view) {
  const axisColor = d3.hsl(0, 0, 0.85);
  const axis = d3.axisBottom(view.mapToX)
    .tickFormat(d3.timeFormat("%Y"))
    .tickSizeOuter(0);
  const axisElement = svg.append("g")
    .attr("transform", `translate(0,${view.height - margin.bottom})`)
    .call(axis);
  axisElement.selectAll("text")
    .attr("fill", axisColor.darker(1))
    .attr("transform", "translate(-12 0) rotate(-45)")
    .style("text-anchor", "end");
  axisElement.selectAll("path")
    .attr("stroke", axisColor);
  axisElement.selectAll("line")
    .attr("stroke", axisColor);
}
