const { validationResult } = require("express-validator");
const CustomErrorClass = require("../services/ErrorClasses");

const validateSchema = (schema) => [
  schema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new CustomErrorClass("00005", errors.mapped()));
    }
    return next();
  },
];

module.exports = validateSchema;
