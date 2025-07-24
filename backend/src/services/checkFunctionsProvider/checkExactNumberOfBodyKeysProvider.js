const CustomErrorClass = require("../ErrorClasses");

const checkExactNumberOfBodyKeysProvider = (
  validNumOfKeys,
  arrOfKeyStr,
  errorNum,
  isZeroNumOfKeysValid = false
) => {
  const checkExactNumberOfBodyKeys = async (req) => {
    const matchingKeys = [];
    arrOfKeyStr.forEach((keyStr) => {
      if (req.body[keyStr]) {
        matchingKeys.push(keyStr);
      }
    });
    if (matchingKeys.length === 0 && isZeroNumOfKeysValid) {
      return null;
    }
    if (matchingKeys.length !== validNumOfKeys) {
      const error = new CustomErrorClass(errorNum);
      return error;
    }
    return null;
  };

  return checkExactNumberOfBodyKeys;
};

module.exports = checkExactNumberOfBodyKeysProvider;
