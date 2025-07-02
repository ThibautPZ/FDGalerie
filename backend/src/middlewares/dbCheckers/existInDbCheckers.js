const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");

const tables = require("../../tables");

const checkContactExists = (checkedValue, rejectWhenTrue = false) => {
  return asyncHandler(async (req, res, next) => {
    const { location, key, columnName } = checkedValue;

    let paramValue = null;
    if (location === "params") {
      const reqParams = req.params;
      paramValue = reqParams[key];
    }
    if (location === "body") {
      paramValue = req.body[key];
    }

    const [result] = await tables.contacts.findByOneParam(
      columnName,
      paramValue
    );
    const doesContactExist = result.length > 0;

    if (doesContactExist === rejectWhenTrue) {
      const contactExistsErr = new CustomErrorClass("04001");
      return next(contactExistsErr);
    }
    return next();
  });
};

module.exports = { checkContactExists };
