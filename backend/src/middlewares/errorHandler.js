const CustomErrorClass = require("../services/ErrorClasses");

const errorHandler = (err, req, res, next) => {
  console.error("errorHandler", err);
  let errorClass = err;

  if (errorClass.name === "validationErrors") {
    const [validationError] = errorClass.errors;
    errorClass = validationError;
  }

  if (errorClass.name === "generic" && errorClass.errors) {
    const [specificError] = errorClass.errors;
    errorClass = specificError;
  }

  if (!(errorClass instanceof CustomErrorClass)) {
    errorClass = new CustomErrorClass("00001");
  }

  res.status(errorClass.statusCode).json({
    success: false,
    errorObj: {
      type: errorClass.type,
      message: errorClass.name,
      code: errorClass.code,
      errors: errorClass.errors,
    },
  });
};

module.exports = errorHandler;
