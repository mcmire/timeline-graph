import _ from "lodash";
import * as d3 from "d3";
import dom from "../dom";
import TokenLine from "./TokenLine";

export default function splitTokensIntoLines(tokens, containingWidth) {
  document.querySelectorAll("*[data-dummy]").forEach(element => element.remove());
  const dummySvg = dom.elementWithNS("svg", "svg", {
    data: { dummy: true },
    children: [
      dom.elementWithNS("svg", "text", { data: { dummy: true }})
    ]
  });
  document.body.appendChild(dummySvg);
  const dummyTextElement = dummySvg.querySelector("text");

  const tokensWithWords = tokens.map(token => {
    return { type: token.type, words: token.text.split(/(\s+)/) };
  });
  let maxWidth = 0;
  let currentTokenLine = new TokenLine(dummyTextElement);
  let currentWord;
  const tokenLines = [];

  tokensWithWords.forEach(token => {
    token.words.forEach(word => {
      const wordToken = { type: token.type, text: word };
      const possibleCurrentTokenLine = currentTokenLine.add(wordToken);

      if (possibleCurrentTokenLine.width > containingWidth) {
        tokenLines.push(currentTokenLine);
        currentTokenLine = new TokenLine(dummyTextElement, [wordToken]);
      } else {
        currentTokenLine = possibleCurrentTokenLine;
      }
    });
  });

  if (currentTokenLine.length > 0) {
    tokenLines.push(currentTokenLine);
  }

  const normalizedTokenLines = tokenLines.map(tokenLine => {
    return tokenLine.reduce((newTokenLine, token) => {
      if (newTokenLine.length > 0 && newTokenLine.last.type === token.type) {
        return newTokenLine.withUpdatedLastToken({
          type: token.type,
          text: newTokenLine.last.text + token.text
        });
      } else {
        return newTokenLine.add({
          type: token.type,
          text: token.text
        });
      }
    }, new TokenLine(dummyTextElement));
  });

  const calculatedWidth = d3.max(_.map(normalizedTokenLines, "width"));

  document.querySelectorAll("*[data-dummy]").forEach(element => element.remove());

  return {
    lines: normalizedTokenLines,
    width: calculatedWidth
  };
}
