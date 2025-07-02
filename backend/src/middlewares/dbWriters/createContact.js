const asyncHandler = require("express-async-handler");
const tables = require("../../tables");
const CustomErrorClass = require("../../services/ErrorClasses");
const {
  strictlyEqualToOneOf,
  isObjectNotEmpty,
} = require("../../services/typesAndValidationChecks");
const { giveTodayDate } = require("../../services/ServiceUtils");

const createContact = asyncHandler(async (req, res, next) => {
  const {
    oeuvreAvailability,
    oeuvreGivenToKnownPerson,
    oeuvreSoldToKnownPerson,
    oeuvreReservedToKnownPerson,
  } = req.body;

  const giveNewContactInfosIfPresent = () => {
    if (
      oeuvreAvailability === 1 &&
      !isObjectNotEmpty(oeuvreGivenToKnownPerson)
    ) {
      return {
        firstname: req.body.oeuvreGivenToFirstname || null,
        lastname: req.body.oeuvreGivenToLastname || null,
      };
    }
    if (
      oeuvreAvailability === 2 &&
      !isObjectNotEmpty(oeuvreSoldToKnownPerson)
    ) {
      return {
        firstname: req.body.oeuvreSoldToFirstname || null,
        lastname: req.body.oeuvreSoldToLastname || null,
      };
    }
    if (
      oeuvreAvailability === 3 &&
      !isObjectNotEmpty(oeuvreReservedToKnownPerson)
    ) {
      return {
        firstname: req.body.oeuvreReservedToFirstname || null,
        lastname: req.body.oeuvreReservedToLastname || null,
      };
    }
    return null;
  };
  const newContact = giveNewContactInfosIfPresent();
  if (
    strictlyEqualToOneOf(oeuvreAvailability, 0, 4) ||
    !isObjectNotEmpty(newContact)
  ) {
    return next();
  }

  const accountDate = giveTodayDate();

  const newContactWithDate = { ...newContact, accountDate };
  const [result] = await tables.contacts.createContact(newContactWithDate);
  if (!result.affectedRows) {
    return next(new CustomErrorClass("00001"));
  }

  return next();
});

module.exports = createContact;
