const asyncHandler = require("express-async-handler");
const CustomErrorClass = require("../services/ErrorClasses");
const multer = require("../helpers/multerHelper");
const {
  isStringNotEmpty,
  isObjectNotEmpty,
} = require("../services/typesAndValidationChecks");

const handleMulterParsing = (
  storageOptions,
  limitsOptions,
  validationSchema,
  ...validationFunctions
) => {
  return asyncHandler(async (req, res, next) => {
    const filesFieldsQuery = req.query.fileFields;
    const fileFieldName = req.query.files;
    const wrongFileNameError = new CustomErrorClass("01100");
    if (!isStringNotEmpty(fileFieldName)) {
      next(wrongFileNameError);
    }
    const fileNameObj = JSON.parse(fileFieldName);

    if (!isObjectNotEmpty(fileNameObj)) {
      next(wrongFileNameError);
    }
    const multerInstance = await multer(
      storageOptions,
      limitsOptions,
      validationSchema,
      validationFunctions
    );
    let multerMW = {};

    if (filesFieldsQuery === "none") {
      multerMW = await multerInstance.none();
    }

    if (filesFieldsQuery === "single") {
      multerMW = await multerInstance.single(fileNameObj.name);
    }

    if (filesFieldsQuery === "array") {
      multerMW = await multerInstance.array(
        fileNameObj.name,
        limitsOptions?.maxCount[fileNameObj.name] || null
      );
    }

    if (filesFieldsQuery === "fields") {
      const fieldsArr = await fileNameObj.fields.map((field) => {
        return {
          name: field.name,
          maxCount: field.maxCount || limitsOptions?.maxCount[field.name],
        };
      });
      multerMW = await multerInstance.fields(fieldsArr);
    }

    return multerMW(req, res, next);
  });
};

module.exports = handleMulterParsing;
