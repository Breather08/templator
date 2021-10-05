export const findObjectValue = (objString, data) => {
  let temp = { ...data };
  let value = "";
  objString.split(".").forEach((item) => {
    value = temp[item];
    if (value instanceof Object) {
      temp = value;
    }
  });
  return `${value}`;
};

export const isNumberString = (value) => /^\d+$/.test(value);
