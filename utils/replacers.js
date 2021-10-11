import { findObjectValue, isNumberString } from "./helpers.js";
import { variableRegex, bracketsRegex } from './regExps.js'

export const templateVariableReplacer = (data) => {
  return (str) => {
    if (str.includes(".")) {
      return findObjectValue(str, { ...data });
    }
    if (isNumberString(str)) {
      return str;
    }
    return data[str];
  };
};

export const replaceValuesInSpecials = (target, data) => {
  return target
    .replaceAll(variableRegex, templateVariableReplacer(data))
    .replaceAll(bracketsRegex, "");
};

export const conditionalsReplacer = (data) => {
  return (target, value) => {
    value = findObjectValue(value, data);
    if (value === "true") {
      return replaceValuesInSpecials(target, data);
    }
    if (value === "false") {
      return "";
    }

    return !findObjectValue(value, data)
      ? ""
      : replaceValuesInSpecials(target, data);
  };
};
