const {
  isObjectNotEmpty,
  isStringNotEmpty,
} = require("./typesAndValidationChecks");

const giveObjectsNotEmpty = (...objects) => {
  const returnedArr = [];
  for (const element of objects) {
    if (isObjectNotEmpty(element)) {
      returnedArr.push(element);
    }
  }
};

function iterateObj(object, callback) {
  if (!isObjectNotEmpty) {
    return false;
  }
  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = object[key];
    callback(key, value, object);
  }
  return true;
}

function getObjectNestedValue(object, key) {
  if (!isObjectNotEmpty(object) || !isStringNotEmpty(key)) {
    return null;
  }
  return key
    .split(".")
    .reduce((current, segment) => current?.[segment], object);
}
module.exports = { giveObjectsNotEmpty, iterateObj, getObjectNestedValue };
