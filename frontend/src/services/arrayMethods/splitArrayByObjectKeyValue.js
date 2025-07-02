/**
 * Returns an object containing two arrays from an array of objects, filtered by one of its key/value pair
 * @param {Array.<Object>} arr - Filtered array
 * @param {(string|number)} key - Searched object key
 * @param {(string|number)} value - Searched object value at the defined key
 * @returns {?{matchingObjects: Array.<Object>, unmatchingObjects: Array.<Object>}} Object containing two arrays
 * @function
 */
const splitArrayByObjectKeyValue = (arr, key, value) => {
  const matchingObjects = [];
  const unmatchingObjects = [];
  if (arr?.length) {
    arr.forEach((obj) => {
      if (obj[key] === value) {
        matchingObjects.push(obj);
      } else {
        unmatchingObjects.push(obj);
      }
    });
  }
  return { matchingObjects, unmatchingObjects };
};

export default splitArrayByObjectKeyValue;
