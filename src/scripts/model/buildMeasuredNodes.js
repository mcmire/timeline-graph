import { maxTextBoxWidth } from "../config";
import MeasuredGraphNode from "./MeasuredGraphNode";
import tagTokensIn from "./tagTokensIn";
import typesetText from "./typesetText";

export default function buildMeasuredNodes(nodes) {
  return nodes.map(node => {
    if (node.event.isHidden) {
      return new MeasuredGraphNode({ ...node, lines: [], width: 0, height: 0 });
    } else {
      const tokens = tagTokensIn(
        node.event.text,
        { surroundedBy: "**", withName: "bold" }
      );
      const { lines, width, height } = typesetText(tokens, maxTextBoxWidth);
      return new MeasuredGraphNode({ ...node, lines, width, height });
    }
  });
}
