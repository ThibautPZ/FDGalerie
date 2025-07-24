const expressAsyncHandler = require("express-async-handler");
const { isPositiveNumber } = require("../../services/typesAndValidationChecks");
const tables = require("../../tables");
const CustomErrorClass = require("../../services/ErrorClasses");

const addFamilyMemberNumber = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  if (!isPositiveNumber(body.oeuvreFamily)) {
    return next();
  }
  const [result] = await tables.families.readMaxFamilyNumber(body.oeuvreFamily);
  const previousMaxFamilyMember = result[0].maxFamilyMember;

  if (isPositiveNumber(previousMaxFamilyMember)) {
    const newFamilyMemberNumber = previousMaxFamilyMember + 1;
    body.familyMember = newFamilyMemberNumber;
  } else {
    const err = new CustomErrorClass("paintingMaxFamilyMemberNotFound");
    return next(err);
  }

  return next();
});
module.exports = addFamilyMemberNumber;
