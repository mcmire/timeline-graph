import _ from "lodash";

export default function tagTokensIn(text, args) {
  const tokenWrapper = _.escapeRegExp(args.surroundedBy);
  const tokenType = args.withName;
  const regexp = new RegExp(`${tokenWrapper}.+?${tokenWrapper}`, "g");

  let match;
  const matches = [];
  while (match = regexp.exec(text)) {
    matches.push({
      startIndex: match.index,
      endIndex: regexp.lastIndex
    });
  }

  if (matches.length > 0) {
    const pieces = [
      {
        type: "normal",
        text: text.slice(0, matches[0].startIndex)
      }
    ];

    for (let i = 0; i < matches.length; i++) {
      const regexp = new RegExp(`${tokenWrapper}(.+?)${tokenWrapper}`);
      const match = matches[i];
      const nextMatch = matches[i + 1];

      const a = match.startIndex;
      const b = match.endIndex;
      const c = nextMatch == null ? null : nextMatch.startIndex;

      pieces.push({
        type: tokenType,
        text: text.slice(a, b).replace(regexp, (_, $1) => $1)
      });

      if (c != null) {
        pieces.push({
          type: "normal",
          text: text.slice(b, c)
        });
      }
    }

    pieces.push({
      type: "normal",
      text: text.slice(matches[matches.length - 1].endIndex)
    });

    return pieces.filter(piece => !_.isEmpty(piece.text));
  } else {
    return [];
  }
}
