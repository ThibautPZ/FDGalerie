const { checkSchema } = require("express-validator");
const {
  requiredStr,
  requiredArr,
  requiredInt,
  requiredFloat,
  nullableStr,
  nullableInt,
} = require("./schemaOptions");
const { uppercaseFirstChar } = require("../services/stringFunctions");
const { hasValue } = require("../services/typesAndValidationChecks");

const objectFieldValidation = (req, objectFieldName) => {
  const { userId, contactId } = req.body[objectFieldName];
  if (hasValue(userId) && hasValue(contactId)) {
    return false;
  }
  if (!hasValue(userId) && !hasValue(contactId)) {
    return false;
  }
  return true;
};

const giveKnownPersonObjOptions = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  const returnedObj = {
    optional: { options: { values: "falsy" } },
    isObject: { errorMessage: `wrong${uppercasedFieldName}` },
    custom: {
      options: (value, { req }) => objectFieldValidation(req, fieldName),
      errorMessage: `wrong${uppercasedFieldName}`,
    },
  };
  return returnedObj;
};

const createPaintingSchema = () => {
  const oeuvreTitleOptions = requiredStr("oeuvreTitle");
  const oeuvreTechniqueOptions = requiredArr("oeuvreTechnique");
  const oeuvreTechniqueElementOptions = requiredInt("oeuvreTechnique");
  const oeuvreSupportOptions = requiredInt("oeuvreSupport");
  const oeuvreFormatOptions = requiredInt("oeuvreFormat");
  const oeuvreHeightOptions = requiredFloat("oeuvreHeight");
  const oeuvreWidthOptions = requiredFloat("oeuvreWidth");
  const oeuvreAvailabilityOptions = requiredInt("oeuvreAvailability");
  const oeuvreGivenToFirstnameOptions = nullableStr("oeuvreGivenToFirstname");
  const oeuvreGivenToLastnameOptions = nullableStr("oeuvreGivenToLastname");
  const oeuvreGivenToKnownPersonOptions = giveKnownPersonObjOptions(
    "oeuvreGivenToKnownPerson"
  );
  const oeuvreGivenToKnownPersonUserIdOptions = nullableInt(
    "oeuvreGivenToKnownPersonUserId"
  );
  const oeuvreGivenToKnownPersonContactIdOptions = nullableInt(
    "oeuvreGivenToKnownPersonContactId"
  );
  const oeuvreGivenToKnownPersonFirstnameOptions = nullableStr(
    "oeuvreGivenToKnownPersonFirstname"
  );
  const oeuvreGivenToKnownPersonLastnameOptions = nullableStr(
    "oeuvreGivenToKnownPersonLastname"
  );
  const oeuvreSoldToFirstnameOptions = nullableStr("oeuvreSoldToFirstname");
  const oeuvreSoldToLastnameOptions = nullableStr("oeuvreSoldToLastname");
  const oeuvreSoldToKnownPersonOptions = giveKnownPersonObjOptions(
    "oeuvreSoldToKnownPerson"
  );
  const oeuvreSoldToKnownPersonUserIdOptions = nullableInt(
    "oeuvreSoldToKnownPersonUserId"
  );
  const oeuvreSoldToKnownPersonContactIdOptions = nullableInt(
    "oeuvreSoldToKnownPersonContactId"
  );
  const oeuvreSoldToKnownPersonFirstnameOptions = nullableStr(
    "oeuvreSoldToKnownPersonFirstname"
  );
  const oeuvreSoldToKnownPersonLastnameOptions = nullableStr(
    "oeuvreSoldToKnownPersonLastname"
  );
  const oeuvreReservedToFirstnameOptions = nullableStr(
    "oeuvreReservedToFirstname"
  );
  const oeuvreReservedToLastnameOptions = nullableStr(
    "oeuvreReservedToLastname"
  );
  const oeuvreReservedToKnownPersonOptions = giveKnownPersonObjOptions(
    "oeuvreReservedToKnownPerson"
  );
  const oeuvreReservedToKnownPersonUserIdOptions = nullableInt(
    "oeuvreReservedToKnownPersonUserId"
  );
  const oeuvreReservedToKnownPersonContactIdOptions = nullableInt(
    "oeuvreReservedToKnownPersonContactId"
  );
  const oeuvreReservedToKnownPersonFirstnameOptions = nullableStr(
    "oeuvreReservedToKnownPersonFirstname"
  );
  const oeuvreReservedToKnownPersonLastnameOptions = nullableStr(
    "oeuvreReservedToKnownPersonLastname"
  );

  return checkSchema({
    oeuvreTitle: oeuvreTitleOptions,
    oeuvreTechnique: oeuvreTechniqueOptions,
    "oeuvreTechnique.*": oeuvreTechniqueElementOptions,
    oeuvreSupport: oeuvreSupportOptions,
    oeuvreFormat: oeuvreFormatOptions,
    oeuvreWidth: oeuvreWidthOptions,
    oeuvreHeight: oeuvreHeightOptions,
    oeuvreAvailability: oeuvreAvailabilityOptions,
    oeuvreGivenToFirstname: oeuvreGivenToFirstnameOptions,
    oeuvreGivenToLastname: oeuvreGivenToLastnameOptions,
    oeuvreGivenToKnownPerson: oeuvreGivenToKnownPersonOptions,
    "oeuvreGivenToKnownPerson.userId": oeuvreGivenToKnownPersonUserIdOptions,
    "oeuvreGivenToKnownPerson.contactId":
      oeuvreGivenToKnownPersonContactIdOptions,
    "oeuvreGivenToKnownPerson.firstname":
      oeuvreGivenToKnownPersonFirstnameOptions,
    "oeuvreGivenToKnownPerson.lastname":
      oeuvreGivenToKnownPersonLastnameOptions,
    oeuvreSoldToFirstname: oeuvreSoldToFirstnameOptions,
    oeuvreSoldToLastname: oeuvreSoldToLastnameOptions,
    oeuvreSoldToKnownPerson: oeuvreSoldToKnownPersonOptions,
    "oeuvreSoldToKnownPerson.userId": oeuvreSoldToKnownPersonUserIdOptions,
    "oeuvreSoldToKnownPerson.contactId":
      oeuvreSoldToKnownPersonContactIdOptions,
    "oeuvreSoldToKnownPerson.firstname":
      oeuvreSoldToKnownPersonFirstnameOptions,
    "oeuvreSoldToKnownPerson.lastname": oeuvreSoldToKnownPersonLastnameOptions,
    oeuvreReservedToFirstname: oeuvreReservedToFirstnameOptions,
    oeuvreReservedToLastname: oeuvreReservedToLastnameOptions,
    oeuvreReservedToKnownPerson: oeuvreReservedToKnownPersonOptions,
    "oeuvreReservedToKnownPerson.userId":
      oeuvreReservedToKnownPersonUserIdOptions,
    "oeuvreReservedToKnownPerson.contactId":
      oeuvreReservedToKnownPersonContactIdOptions,
    "oeuvreReservedToKnownPerson.firstname":
      oeuvreReservedToKnownPersonFirstnameOptions,
    "oeuvreReservedToKnownPerson.lastname":
      oeuvreReservedToKnownPersonLastnameOptions,
  });
};

module.exports = createPaintingSchema;
