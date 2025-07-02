import {
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
  const areArgumentsValidAndCheckedObjHasOneKey = hasOneKey(checkedObj, objKey);
  if (!areArgumentsValidAndCheckedObjHasOneKey) {
    return false;
  }
  const checkedValue = checkedObj[objKey];
  const isCheckedValueTruthy = !!checkedValue;
  return isCheckedValueTruthy;
};

export { hasOneKey, hasOneKeyWithTruthyValue };
