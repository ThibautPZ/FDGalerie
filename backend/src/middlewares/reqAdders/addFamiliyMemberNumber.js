const expressAsyncHandler = require("express-async-handler");
const { isPositiveNumber } = require("../../services/typesAndValidationChecks");
const tables = require("../../tables");

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
    body.familyMember = 1;
  }

  return next();
});
module.exports = addFamilyMemberNumber;
