const giveType = (checked) => {
  return Object.prototype.toString.call(checked).slice(8, -1).toLowerCase();
};

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

const isFunction = (checked) => {
  if (!checked) {
    return false;
  }
  return {}.toString.call(checked) === "[object Function]";
};

const isPromise = (checked) => {
  if (!checked) {
    return false;
  }
  return Promise.resolve(checked) === checked;
};

const isDate = (checked) => {
  if (!checked) {
    return false;
  }
  return {}.toString.call(checked) === "[object Date]";
};

const isBoolean = (checked) => {
  return checked === false || checked === true;
};

export {
  giveType,
  isArray,
  isArrayNotEmpty,
  isString,
  isStringNotEmpty,
  isObject,
  isObjectNotEmpty,
  isNumber,
  isPositiveNumber,
  isNegativeNumber,
  isFunction,
  isPromise,
  isDate,
  isBoolean,
};
