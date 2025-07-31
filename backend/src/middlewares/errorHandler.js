const CustomErrorClass = require("../services/ErrorClasses");
const {
  isString,
  isArrayNotEmpty,
} = require("../services/typesAndValidationChecks");

const giveInfoData = (errorContent) => {
  if (!errorContent) {
    return null;
  }
  const infoData = {};
  if (isString(errorContent)) {
    infoData.insertText1 = errorContent;
  }
  if (isArrayNotEmpty(errorContent)) {
    errorContent.forEach((element, index) => {
      infoData[`insertText${index + 1}`] = element;
    });
  }
  return infoData;
};

const errorHandler = (err, req, res, next) => {
  console.error("errorHandler", err);
  let errorClass = err;

  // if (errorClass.name === "validationErrors") {
  //   const [validationError] = errorClass.errors;
  //   errorClass = validationError;
  // }

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
      code: errorClass.publicCode,
      errors: null,
      infoData: giveInfoData(errorClass.content),
    },
  });
};

module.exports = errorHandler;
