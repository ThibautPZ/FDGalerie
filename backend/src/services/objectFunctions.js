const { isObjectNotEmpty } = require("./typesAndValidationChecks");

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
module.exports = { giveObjectsNotEmpty, iterateObj };
