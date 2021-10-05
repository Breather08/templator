import { findObjectValue, isNumberString } from "../utils/helpers.js";

export class Templator {
  _variableRegex = /(?!{{\s*)[a-z0-9.\-_]+(?=\s*}})/gi;

  _bracketsRegex = /(\s*}})|({{\s*)/gi;

  _loopBracketsRegex = /\s*{{\s*#.+/g;

  _loopRegex =
    /(?<={{\s*#for\s(\w+)\sin\s(\d|\w+)\s*}}\s*)(.|\n)+(?=\n?\s*{{\s*#rof\s*}})/gi;

  _commentsRegex = /<!--(.|\n)*-->/gi;

  _templateVariableReplacer(data) {
    return (str) => {
      if (str.includes(".")) {
        return findObjectValue(str, { ...data });
      }
      if (isNumberString(str)) {
        return str;
      }
      return data[str];
    };
  }

  /**
   * Compiles template to a function, which can be rendered
   * multiple times with different data
   * @param {string} template 
   * @returns {(data: Record<string, any>) => string}
   */
  compile(template) {
    return (data) => this.render(template, data);
  }

  /**
   * Returns rendered html template with passed locals
   * @param {string} template 
   * @param {Record<string, any>} data 
   * @returns {string}
   */
  render(template, data = {}) {
    return (
      template
        // Remove all comments
        .replaceAll(this._commentsRegex, "")
        // Generate loop items
        .replaceAll(this._loopRegex, (target, iterable, rangeValue) => {
          let rangeString = "";
          let range = isNumberString(rangeValue)
            ? [...new Array(Number(rangeValue))].map((_, i) => i)
            : data[rangeValue];

          const obj = {};
          range.forEach((item) => {
            obj[iterable] = item;
            rangeString += `${target
              .replaceAll(
                this._variableRegex,
                this._templateVariableReplacer(obj)
              )
              .replaceAll(this._bracketsRegex, "")}\n`;
          });
          return rangeString;
        })
        // Replace all loop brackets
        .replaceAll(this._loopBracketsRegex, "")
        // Replace all variables
        .replaceAll(this._variableRegex, this._templateVariableReplacer(data))
        // Remove all brackets
        .replaceAll(this._bracketsRegex, "")
    );
  }
}
