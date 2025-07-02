const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");
const { isObjectNotEmpty } = require("../../services/typesAndValidationChecks");

const checkIfRequestBodyIsObjectNotEmpty = asyncHandler(
  async (req, res, next) => {
    if (!isObjectNotEmpty(req.body)) {
      const emptyBodyErr = new CustomErrorClass("00003");
      return next(emptyBodyErr);
    }

    return next();
  }
);

module.exports = checkIfRequestBodyIsObjectNotEmpty;
