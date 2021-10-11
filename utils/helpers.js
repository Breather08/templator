export const findObjectValue = (objString, data) => {
  let temp = { ...data };
  let value = "";
  if (!objString.includes(".")) {
    return objString;
  }
  objString.split(".").forEach((item) => {
    value = temp[item];
    if (value instanceof Object) {
      temp = value;
    }
  });
  return `${value}`;
};

export const isNumberString = (value) => /^\d+$/.test(value);

export const handleConditionalStrings = (value) => {
  return value !== "false" && value;
};
