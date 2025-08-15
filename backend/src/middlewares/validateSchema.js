const { validationResult, matchedData } = require("express-validator");
const CustomErrorClass = require("../services/ErrorClasses");

const validateSchema = (schema) => [
  schema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new CustomErrorClass("00005", errors.mapped()));
    }
    req.body = matchedData(req);
    return next();
  },
];

module.exports = validateSchema;
