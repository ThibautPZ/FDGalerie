const asyncHandler = require("express-async-handler");
const schemaValidationErrors = require("../services/expressValidator");
const CustomErrorClass = require("../services/ErrorClasses");
const { isArrayNotEmpty } = require("../services/typesAndValidationChecks");
const { giveErrorInstances } = require("../services/arrayFunctions");

const handleVerificationsOnReqIfNoFiles = (
  validationSchema,
  ...validationFunctions
) => {
  return asyncHandler(async (req, res, next) => {
    const filesFieldsQuery = req.query.fileFields;
    if (filesFieldsQuery !== "none") {
      return next();
    }
    const reqBody = JSON.parse(JSON.stringify(req.body));
    req.body = reqBody;

    let schemaErrors = null;
    if (validationSchema) {
      schemaErrors = await schemaValidationErrors(validationSchema, req);
    }
    if (schemaErrors) {
      return next(schemaErrors);
    }
    if (isArrayNotEmpty(validationFunctions)) {
      const promisesArr = validationFunctions.map((validationFunction) =>
        validationFunction(req)
      );
      const validationsResultsArr = await Promise.all(promisesArr);
      const errorsArr = giveErrorInstances(validationsResultsArr);
      if (isArrayNotEmpty(errorsArr)) {
        const validationsErr = new CustomErrorClass("00005", errorsArr);
        return next(validationsErr);
      }
    }
    return next();
  });
};

module.exports = handleVerificationsOnReqIfNoFiles;
