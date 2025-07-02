/**
 * Gives number of characters available in text input.
 * @function
 * @param {string} value - String being registered (use of RHF watch function: "watch(fieldName)").
 * @param {number} maxValue - Maximum number of characters of the value string.
 * @returns {number}
 */
const giveRemainingCharacters = (value, maxValue) => {
  if (value) {
    return maxValue - value.length;
  }
  return maxValue;
};

export default giveRemainingCharacters;
