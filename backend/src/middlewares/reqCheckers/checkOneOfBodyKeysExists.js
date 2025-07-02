const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");

const checkOneOfBodyKeysExists = (arrOfKeyStr) => {
  return asyncHandler(async (req, res, next) => {
    const matchingKeys = [];
    arrOfKeyStr.forEach((keyStr) => {
      if (req.body[keyStr]) {
        matchingKeys.push(keyStr);
      }
    });
    if (matchingKeys.length === 0) {
      const noContactNameErr = new CustomErrorClass("05001");
      return next(noContactNameErr);
    }

    return next();
  });
};

module.exports = checkOneOfBodyKeysExists;
