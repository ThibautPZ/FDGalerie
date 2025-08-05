const expressAsyncHandler = require("express-async-handler");
const CustomErrorClass = require("../../services/ErrorClasses");

const checkPaintingVisibility = expressAsyncHandler(async (req, res, next) => {
  const { body, query } = req;

  if (body.oeuvreVisibility === true && query.fileFields === "none") {
    return next(new CustomErrorClass("05004"));
  }
  return next();
});
module.exports = checkPaintingVisibility;
