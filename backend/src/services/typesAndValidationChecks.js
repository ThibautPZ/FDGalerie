const isArray = (checked) => {
  if (!checked) {
    return false;
  }
  return Array.isArray(checked);
};

const isArrayNotEmpty = (checked) => {
  if (!isArray(checked)) {
    return false;
  }
  return checked.length > 0;
};

const isString = (checked) => {
  return typeof checked === "string";
};

const isStringNotEmpty = (checked) => {
  if (!isString(checked)) {
    return false;
  }
  return checked.length > 0;
};

const isObject = (checked) => {
  if (!checked) {
    return false;
  }
  return checked.toString() === "[object Object]";
};

const isObjectNotEmpty = (checked) => {
  if (!isObject(checked)) {
    return false;
  }
  const entriesArr = Object.entries(checked);
  return entriesArr.length > 0;
};

const isThereObjectsNotEmpty = (...checked) => {
  for (const element of checked) {
    if (isObjectNotEmpty(element)) {
      return true;
    }
  }
  return false;
};

const isNumber = (checked) => {
  return typeof checked === "number";
};

const isPositiveNumber = (checked) => {
  if (!isNumber(checked)) {
    return false;
  }
  return checked > 0;
};

const isNegativeNumber = (checked) => {
  if (!isNumber(checked)) {
    return false;
  }
  return checked < 0;
};

const isNotUndefined = (checked) => {
  if (typeof checked === "undefined") {
    return false;
  }
  return true;
};

const hasValue = (checked) => {
  if (typeof checked === "undefined" || checked === null) {
    return false;
  }
  return true;
};

const strictlyEqualToOneOf = (checked, ...values) => {
  for (const value of values) {
    if (value === checked) {
      return true;
    }
  }

  return false;
};

module.exports = {
  isArray,
  isArrayNotEmpty,
  isString,
  isStringNotEmpty,
  isObject,
  isObjectNotEmpty,
  isThereObjectsNotEmpty,
  isNumber,
  isPositiveNumber,
  isNegativeNumber,
  isNotUndefined,
  hasValue,
  strictlyEqualToOneOf,
};
