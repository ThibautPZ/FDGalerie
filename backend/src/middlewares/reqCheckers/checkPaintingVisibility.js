const expressAsyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");
const { isObjectNotEmpty } = require("../../services/typesAndValidationChecks");

const checkPaintingVisibility = expressAsyncHandler(async (req, res, next) => {
  const { body, query } = req;

  const { oeuvreFileDeleteFile, detailedPaintingData } = body;

  if (body.oeuvreVisibility === false) {
    return next();
  }

  if (!isObjectNotEmpty(detailedPaintingData) && query.fileFields === "none") {
    return next(new CustomErrorClass("05004"));
  }

  if (oeuvreFileDeleteFile && query.fileFields === "none") {
    return next(new CustomErrorClass("05004"));
  }

  return next();
});
module.exports = checkPaintingVisibility;
