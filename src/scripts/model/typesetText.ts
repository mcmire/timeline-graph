import { lineHeight, textBoxPadding } from "../config";
import splitTokensIntoLines from "./splitTokensIntoLines";

export default function typesetText(tokens, maxWidth) {
  const { lines, width } = splitTokensIntoLines(tokens, maxWidth);
  const height = lineHeight * lines.length;
  return {
    lines: lines,
    width: width + textBoxPadding * 2,
    height: (height + textBoxPadding * 2) - 2
  };
}
