import * as d3 from "d3";
import { fontSize, lineHeight, textBoxPadding } from "../config";

export default function addTextBoxesTo(svg, view) {
  const nonHiddenNodes = view.nodes.filter(node => {
    return !node.event.isHidden;
  });

  svg
    .append("g")
    .selectAll("g").data(nonHiddenNodes).enter().append("g")
    .each((node, nodeIndex, elements) => {
      const groupElement = d3.select(elements[nodeIndex]);

      groupElement.append("rect")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("fill", "rgba(255,255,255)")
        .attr("x", node.x + 0.5)
        .attr("y", node.adjustedY + 0.5)
        .attr("width", `${node.width}px`)
        .attr("height", `${node.height}px`);

      const textElement = groupElement.append("text")
        .attr("color", "black")
        .attr("style", `font-size: ${fontSize}px`)
        .attr("x", node.x + textBoxPadding + 0.5)
        .attr("y", node.adjustedY + textBoxPadding + 0.5);

      node.lines.forEach((line, lineIndex) => {
        line.tokens.forEach((token, tokenIndex) => {
          textElement.append("tspan")
            .text(token.text)
            .attr(
              "style",
              `font-weight: ${token.type === "bold" ? "bold" : "normal"}`
            )
            .attr("alignment-baseline", "hanging")
            .attr("x", tokenIndex === 0 ? node.x + textBoxPadding : null)
            .attr("dy", (lineIndex === 0 || tokenIndex > 0) ? 0 : lineHeight);
        });
      });
    });
}
