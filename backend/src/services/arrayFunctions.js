const { isArrayNotEmpty } = require("./typesAndValidationChecks");

const giveErrorInstances = (array) => {
  if (!isArrayNotEmpty(array)) {
    return [];
  }
  const returnedArr = array.filter((element) => element instanceof Error);
  return returnedArr;
};

module.exports = { giveErrorInstances };
