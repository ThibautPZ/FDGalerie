const CustomErrorClass = require("../services/ErrorClasses");

const errorHandler = (err, req, res, next) => {
  console.error("errorHandler", err);

  let errorClass = err;
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
