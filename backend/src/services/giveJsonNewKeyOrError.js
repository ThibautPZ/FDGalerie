const CustomErrorClass = require("./ErrorClasses");
const { caseToUpperCase } = require("./stringFunctions");

/**
 * Attempts to generate a new key for a JSON object based on language data, or returns an error if the key already exists.
 *
 * @param {Object} languages - An object where each key maps to an object containing a `file` (object) and a `name` (string).
 * @param {string} [errorNumber="00001"] - The error number to use when creating a new error.
 * @returns {{ techniqueKey: string, error: (Error|null) }} An object containing the new technique key (or empty string on error) and an error instance if a conflict is found, otherwise null.
 */
const giveJsonNewKeyOrError = (languages, errorNumber = "00001") => {
  for (const [key, { file, name }] of Object.entries(languages)) {
    const techniqueKey = caseToUpperCase(name);
    if (file[techniqueKey]?.name === name) {
      const err = new CustomErrorClass(errorNumber, key);
      return { techniqueKey: "", error: err };
    }
    if (!file[techniqueKey]) {
      return { techniqueKey, error: null };
    }
  }
  const err = new CustomErrorClass(errorNumber);
  return { techniqueKey: "", error: err };
};

module.exports = giveJsonNewKeyOrError;
