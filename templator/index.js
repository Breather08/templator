import { findObjectValue, isNumberString } from "../utils/helpers.js";

export class Templator {
  _variableRegex = /(?!{{\s*)[a-z0-9.\-_]+(?=\s*}})/gi;

  _bracketsRegex = /(\s*}})|({{\s*)/gi;

  _specialBracketsRegex = /\s*{{\s*#.+/g;

  _conditionalsRegex =
    /(?<={{\s*#if\s([a-z0-9._]+)\s*}}\s*)(.|\n)+(?=\n?\s*{{\s*#fi\s*}})/gi;
  // TODO: Remove positive lookbehind (fails on Safari)
  _loopRegex =
    /(?<={{\s*#for\s(\w+)\sin\s([a-z0-9._]+)\s*}}\s*)(.|\n)+(?=\n?\s*{{\s*#rof\s*}})/gi;

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

  _handleConditionals(value) {
    return value !== "false" && value;
  }

  _replaceValuesInSpecials(target, data) {
    return target
      .replaceAll(this._variableRegex, this._templateVariableReplacer(data))
      .replaceAll(this._bracketsRegex, "");
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
            rangeString += `${this._replaceValuesInSpecials(target, obj)}\n`;
          });
          return rangeString;
        })
        // Handle conditionals
        .replaceAll(this._conditionalsRegex, (target, value) => {
          value = findObjectValue(value, data)
          if (value === "true")
            return this._replaceValuesInSpecials(target, data);
          if (value === "false") return "";

          return !findObjectValue(value, data)
            ? ""
            : this._replaceValuesInSpecials(target, data);
        })
        // Remove all special brackets
        .replaceAll(this._specialBracketsRegex, "")
        // Replace all variables
        .replaceAll(this._variableRegex, this._templateVariableReplacer(data))
        // Remove all brackets
        .replaceAll(this._bracketsRegex, "")
    );
  }
}
