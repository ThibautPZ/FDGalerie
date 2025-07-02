/**
 * Returns an array containing all inputed object values whose key match inputed array string elements
 * @param {Object.<{string, Object}>} obj - Searched object
 * @param {Array.<string>} arrOfKeys - Array listing strings to be compared to obj keys
 * @returns {Array.<Object>}  Object containing two arrays
 * @function
 */
const giveMatchingObjectValues = (obj, arrOfKeys) => {
  const returnedArr = [];
  if (!arrOfKeys.length || typeof arrOfStr === "string" || !obj) {
    return returnedArr;
  }

  arrOfKeys.forEach((key) => {
    if (typeof key === "string" && obj[key]) {
      returnedArr.push(obj[key]);
    }
  });
  return returnedArr;
};

export default giveMatchingObjectValues;
