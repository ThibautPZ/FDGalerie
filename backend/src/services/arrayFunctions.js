const { isArrayNotEmpty } = require("./typesAndValidationChecks");

const giveErrorInstances = (array) => {
  if (!isArrayNotEmpty(array)) {
    return [];
  }
  const returnedArr = array.filter((element) => element instanceof Error);
  return returnedArr;
};

const giveValuesExclusivesBetween2Arrays = (arr1, arr2) => {
  if (!isArrayNotEmpty(arr1) || !isArrayNotEmpty(arr2)) {
    return [[], []];
  }
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const exclusivesToArr1 = arr1.filter((item) => !set2.has(item));
  const exclusivesToArr2 = arr2.filter((item) => !set1.has(item));

  return [exclusivesToArr1, exclusivesToArr2];
};

module.exports = { giveErrorInstances, giveValuesExclusivesBetween2Arrays };
