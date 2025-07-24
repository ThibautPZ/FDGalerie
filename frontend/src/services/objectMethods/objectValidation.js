import {
  isArrayNotEmpty,
  isObjectNotEmpty,
  isStringNotEmpty,
} from "../typesAndValidationChecks";

const hasOneKey = (checkedObj, objKey) => {
  const isCheckedObjPopulated = isObjectNotEmpty(checkedObj);
  const isObjKeyStringNotEmpty = isStringNotEmpty(objKey);
  if (!isCheckedObjPopulated || !isObjKeyStringNotEmpty) {
    return false;
  }
  const objHasKey = Object.hasOwn(checkedObj, objKey);
  return objHasKey;
};

const hasOneKeyWithTruthyValue = (checkedObj, objKey) => {
  const isCheckedObjPopulated = isObjectNotEmpty(checkedObj);
  const isObjKeyStringNotEmpty = isStringNotEmpty(objKey);
  if (!isCheckedObjPopulated || !isObjKeyStringNotEmpty) {
    return false;
  }

  if (!hasOneKey(checkedObj, objKey)) {
    return false;
  }
  const checkedValue = checkedObj[objKey];
  const isCheckedValueTruthy = !!checkedValue;
  return isCheckedValueTruthy;
};

const hasKeysWithTruthyValue = (checkedObj, objKeys, numberOfTruthyValues) => {
  const isCheckedObjPopulated = isObjectNotEmpty(checkedObj);
  const isObjKeyStringNotEmpty = isArrayNotEmpty(objKeys);
  if (!isCheckedObjPopulated || !isObjKeyStringNotEmpty) {
    return false;
  }
  let truthyCount = 0;
  objKeys.forEach((key) => {
    if (hasOneKey(checkedObj, key) && !!checkedObj[key]) {
      truthyCount += 1;
    }
  });
  if (numberOfTruthyValues) {
    return numberOfTruthyValues === truthyCount;
  }
  return !!truthyCount;
};

export { hasOneKey, hasOneKeyWithTruthyValue, hasKeysWithTruthyValue };
