import * as d3 from "d3";
import dom from "../dom";
import addNodeConnectionsTo from "./addNodeConnectionsTo";
import addTextBoxesTo from "./addTextBoxesTo";
import addXAxisTo from "./addXAxisTo";

export default function renderGraph(view) {
  const wrapper = d3.select(dom.element("div"))
    .style("overflow-x", "auto")
    .style("background-color", "hsl(30,75%,96%)");
  const svg = wrapper.append("svg")
    .style("width", view.width)
    .style("height", view.height);

  addNodeConnectionsTo(svg, view);
  addTextBoxesTo(svg, view);
  addXAxisTo(svg, view);

  return wrapper.node();
}
