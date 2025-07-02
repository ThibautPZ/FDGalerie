import splitArrayByObjectKeyValue from "./splitArrayByObjectKeyValue";

/**
 * From an array of objects, selects objects matching the inputted targetedObjKey&Value key/value pair, then mutates them at the inputted objMutatedKey key with objMutatedValue value.
 * @param {Array.<Object>} arr - Filtered array
 * @param {(string|number)} targetedObjKey - Searched object key
 * @param {(string|number|any)} targetedObjValue - Searched object value at the defined targetedObjKey key
 * @param {(string|number)} objMutatedKey - Searched object value at the defined key
 * @param {(string|number|any)} objMutatedValue - Searched object value at the defined key
 * @returns {Array} Mutated array containing all inputted array elements
 * @function
 */
const newArrayOfObjectsWithValuesUpdated = (
  arr,
  targetedObjKey,
  targetedObjValue,
  objMutatedKey,
  objMutatedValue
) => {
  if (!arr.length) {
    return [];
  }
  const { matchingObjects, unmatchingObjects } = splitArrayByObjectKeyValue(
    arr,
    targetedObjKey,
    targetedObjValue
  );
  matchingObjects.forEach((obj) => {
    unmatchingObjects.push({ ...obj, [objMutatedKey]: objMutatedValue });
  });

  return unmatchingObjects;
};

export default newArrayOfObjectsWithValuesUpdated;
