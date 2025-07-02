const { validationResult } = require("express-validator");
const CustomErrorClass = require("./ErrorClasses");

const schemaValidationErrors = async (schema, req) => {
  await schema().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErr = new CustomErrorClass("00005", errors.mapped());
    return validationErr;
  }
  return null;
};
module.exports = schemaValidationErrors;
