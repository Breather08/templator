import { isNumberString } from "../utils/helpers.js";
import {
  templateVariableReplacer,
  replaceValuesInSpecials,
  conditionalsReplacer,
} from "../utils/replacers.js";
import {
  variableRegex,
  bracketsRegex,
  specialBracketsRegex,
  conditionalsRegex,
  loopRegex,
  commentsRegex,
} from "../utils/regExps.js";

export class Templator {
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
   * Returns rendered html template with passed data
   * @param {string} template
   * @param {Record<string, any>} data
   * @returns {string}
   */
  render(template, data = {}) {
    return (
      template
        // Remove all comments
        .replace(commentsRegex, "")
        // Generate loop items
        .replace(loopRegex, (target, iterable, rangeValue) => {
          let rangeString = "";
          let range = isNumberString(rangeValue)
            ? [...new Array(Number(rangeValue))].map((_, i) => i)
            : data[rangeValue];

          const obj = {};
          range.forEach((item) => {
            obj[iterable] = item;
            const block = target
              .replace(conditionalsRegex, conditionalsReplacer(data))
              .replace(specialBracketsRegex, "");
            rangeString += `${replaceValuesInSpecials(block, obj)}\n`;
          });
          return rangeString;
        })
        // Handle conditionals
        .replace(conditionalsRegex, conditionalsReplacer(data))
        // Remove all special brackets
        .replace(specialBracketsRegex, "")
        // Replace all variables
        .replace(variableRegex, templateVariableReplacer(data))
        // Remove all brackets
        .replace(bracketsRegex, "")
    );
  }
}
