import _ from "lodash";
import { fontSize } from "../config";
import dom from "../dom";

export default class TokenLine {
  constructor(dummyTextElement, tokens = []) {
    this.dummyTextElement = dummyTextElement;
    this.tokens = tokens;
    this.width = this._measure();
  }

  get length() {
    return this.tokens.length;
  }

  get last() {
    return this.tokens[this.tokens.length - 1];
  }

  reduce(fn, acc) {
    return this.tokens.reduce(fn, acc);
  }

  withUpdatedLastToken(token) {
    return new this.constructor(
      this.dummyTextElement,
      this.tokens.slice(0, -1).concat([token])
    );
  }

  cleared() {
    return new this.constructor(this.dummyTextElement);
  }

  add(token) {
    return new this.constructor(
      this.dummyTextElement,
      this.tokens.concat([token])
    );
  }

  _measure() {
    if (this.tokens.length > 0) {
      this.dummyTextElement.setAttribute(
        "style",
        `font-size: ${fontSize}px; alignment-baseline: hanging`
      );
      this.dummyTextElement.textContent = null;

      if (this.dummyTextElement.getBBox().width > 0) {
        console.log(this.dummyTextElement.parentNode);
        throw "Width is already greater than 0?!";
      }

      this.tokens.forEach(token => {
        if (token.type === "bold") {
          const tspan = dom.elementWithNS("svg", "tspan", {
            textContent: token.text,
            style: `font-size: ${fontSize}px; font-weight: bold; alignment-baseline: hanging`
          });
          this.dummyTextElement.appendChild(tspan);
        } else {
          const text = dom.text(token.text);
          this.dummyTextElement.appendChild(text);
        }
      });

      const width = this.dummyTextElement.getBBox().width;

      if (!_.isEmpty(this.dummyTextElement.innerHTML) && width === 0) {
        console.log("innerHTML", this.dummyTextElement.innerHTML);
        throw "Width is 0?!";
      }

      return width;
    } else {
      return 0;
    }
  }
}
