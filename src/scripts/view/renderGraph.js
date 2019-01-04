import * as d3 from "d3";
import addGuidesTo from "./addGuidesTo";
import addNodeConnectionsTo from "./addNodeConnectionsTo";
import addTextBoxesTo from "./addTextBoxesTo";
import addXAxisTo from "./addXAxisTo";
import dom from "../dom";

export default function renderGraph(view) {
  const wrapper = d3.select(dom.element("div"))
    .style("overflow-x", "auto")
    .style("background-color", "hsl(30,75%,96%)");
  const svg = wrapper.append("svg")
    .style("width", view.width)
    .style("height", view.height);

  addGuidesTo(svg, view);
  addNodeConnectionsTo(svg, view);
  addTextBoxesTo(svg, view);
  addXAxisTo(svg, view);

  return wrapper.node();
}
