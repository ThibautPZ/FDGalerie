const { checkSchema, body } = require("express-validator");
const {
  requiredStr,
  requiredArr,
  requiredInt,
  requiredFloat,
  nullableStr,
  nullableInt,
  requiredBool,
} = require("./schemaOptions");
const { uppercaseFirstChar } = require("../services/stringFunctions");
const { hasValue } = require("../services/typesAndValidationChecks");

const paintingAvailability = {
  oeuvreGivenToKnownPerson: 1,
  oeuvreSoldToKnownPerson: 2,
  oeuvreReservedToKnownPerson: 3,
};

const errorMsgPrefix = "crePai_val_";

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
  const paintingAvailabilityRegex = new RegExp(
    `${paintingAvailability[fieldName]}`,
    "g"
  );
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  const returnedObj = {
    exists: {
      if: body("oeuvreAvailability").matches(paintingAvailabilityRegex),
      errorMessage: `${errorMsgPrefix}${uppercasedFieldName}_exi`,
    },
    isObject: { errorMessage: `${errorMsgPrefix}${uppercasedFieldName}_isObj` },
    custom: {
      options: (value, { req }) => objectFieldValidation(req, fieldName),
      errorMessage: `${errorMsgPrefix}${uppercasedFieldName}_ids`,
    },
  };
  return returnedObj;
};

const createPaintingSchema = () => {
  const oeuvreTitleOptions = requiredStr("oeuvreTitle", errorMsgPrefix);
  const oeuvreTechniqueOptions = requiredArr("oeuvreTechnique", errorMsgPrefix);
  const oeuvreTechniqueElementOptions = requiredInt(
    "oeuvreTechnique",
    errorMsgPrefix
  );
  const oeuvreSupportOptions = requiredInt("oeuvreSupport", errorMsgPrefix);
  const oeuvreFormatOptions = requiredInt("oeuvreFormat", errorMsgPrefix);
  const oeuvreHeightOptions = requiredFloat("oeuvreHeight", errorMsgPrefix);
  const oeuvreWidthOptions = requiredFloat("oeuvreWidth", errorMsgPrefix);
  const oeuvreAvailabilityOptions = requiredInt(
    "oeuvreAvailability",
    errorMsgPrefix
  );
  const oeuvreVisibilityOptions = requiredBool(
    "oeuvreVisibility",
    errorMsgPrefix
  );
  const oeuvreFamilyOptions = nullableInt("oeuvreFamily", errorMsgPrefix);
  const oeuvreGivenToFirstnameOptions = nullableStr(
    "oeuvreGivenToFirstname",
    errorMsgPrefix
  );
  const oeuvreGivenToLastnameOptions = nullableStr(
    "oeuvreGivenToLastname",
    errorMsgPrefix
  );
  const oeuvreGivenToKnownPersonOptions = giveKnownPersonObjOptions(
    "oeuvreGivenToKnownPerson"
  );
  const oeuvreGivenToKnownPersonUserIdOptions = nullableInt(
    "oeuvreGivenToKnownPersonUserId",
    errorMsgPrefix
  );
  const oeuvreGivenToKnownPersonContactIdOptions = nullableInt(
    "oeuvreGivenToKnownPersonContactId",
    errorMsgPrefix
  );
  const oeuvreGivenToKnownPersonFirstnameOptions = nullableStr(
    "oeuvreGivenToKnownPersonFirstname",
    errorMsgPrefix
  );
  const oeuvreGivenToKnownPersonLastnameOptions = nullableStr(
    "oeuvreGivenToKnownPersonLastname",
    errorMsgPrefix
  );
  const oeuvreSoldToFirstnameOptions = nullableStr(
    "oeuvreSoldToFirstname",
    errorMsgPrefix
  );
  const oeuvreSoldToLastnameOptions = nullableStr(
    "oeuvreSoldToLastname",
    errorMsgPrefix
  );
  const oeuvreSoldToKnownPersonOptions = giveKnownPersonObjOptions(
    "oeuvreSoldToKnownPerson"
  );
  const oeuvreSoldToKnownPersonUserIdOptions = nullableInt(
    "oeuvreSoldToKnownPersonUserId",
    errorMsgPrefix
  );
  const oeuvreSoldToKnownPersonContactIdOptions = nullableInt(
    "oeuvreSoldToKnownPersonContactId",
    errorMsgPrefix
  );
  const oeuvreSoldToKnownPersonFirstnameOptions = nullableStr(
    "oeuvreSoldToKnownPersonFirstname",
    errorMsgPrefix
  );
  const oeuvreSoldToKnownPersonLastnameOptions = nullableStr(
    "oeuvreSoldToKnownPersonLastname",
    errorMsgPrefix
  );
  const oeuvreReservedToFirstnameOptions = nullableStr(
    "oeuvreReservedToFirstname",
    errorMsgPrefix
  );
  const oeuvreReservedToLastnameOptions = nullableStr(
    "oeuvreReservedToLastname",
    errorMsgPrefix
  );
  const oeuvreReservedToKnownPersonOptions = giveKnownPersonObjOptions(
    "oeuvreReservedToKnownPerson"
  );
  const oeuvreReservedToKnownPersonUserIdOptions = nullableInt(
    "oeuvreReservedToKnownPersonUserId",
    errorMsgPrefix
  );
  const oeuvreReservedToKnownPersonContactIdOptions = nullableInt(
    "oeuvreReservedToKnownPersonContactId",
    errorMsgPrefix
  );
  const oeuvreReservedToKnownPersonFirstnameOptions = nullableStr(
    "oeuvreReservedToKnownPersonFirstname",
    errorMsgPrefix
  );
  const oeuvreReservedToKnownPersonLastnameOptions = nullableStr(
    "oeuvreReservedToKnownPersonLastname",
    errorMsgPrefix
  );
  const artistCommentOptions = nullableStr("artistComment", errorMsgPrefix, {
    maxLength: 254,
  });

  return checkSchema({
    oeuvreTitle: oeuvreTitleOptions,
    oeuvreTechnique: oeuvreTechniqueOptions,
    "oeuvreTechnique.*": oeuvreTechniqueElementOptions,
    oeuvreSupport: oeuvreSupportOptions,
    oeuvreFormat: oeuvreFormatOptions,
    oeuvreWidth: oeuvreWidthOptions,
    oeuvreHeight: oeuvreHeightOptions,
    oeuvreAvailability: oeuvreAvailabilityOptions,
    oeuvreVisibility: oeuvreVisibilityOptions,
    oeuvreFamily: oeuvreFamilyOptions,
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
    artistComment: artistCommentOptions,
  });
};

module.exports = createPaintingSchema;
