import { fontSize, lineHeight, textBoxPadding } from "../config";
import splitTokensIntoLines from "./splitTokensIntoLines";

export default function typesetText(tokens, maxWidth) {
  const { lines, width } = splitTokensIntoLines(tokens, maxWidth);
  const height = lineHeight * lines.length;
  return {
    height: (height + textBoxPadding * 2) - (fontSize * 0.5),
    lines: lines,
    width: width + (textBoxPadding * 2),
  };
}
