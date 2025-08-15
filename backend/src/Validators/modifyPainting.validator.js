const { checkSchema, body } = require("express-validator");
const {
  requiredStr,
  requiredObj,
  requiredArr,
  requiredInt,
  requiredFloat,
  nullableStr,
  nullableInt,
  requiredBool,
} = require("./schemaOptions");
const { uppercaseFirstChar } = require("../services/stringFunctions");
const {
  hasValue,
  isPositiveNumber,
} = require("../services/typesAndValidationChecks");
const { isoDateRegExp } = require("../services/regularExpressions");

const paintingAvailability = {
  oeuvreGivenToKnownPerson: "1",
  oeuvreSoldToKnownPerson: "2",
  oeuvreReservedToKnownPerson: "3",
};

const errorMsgPrefix = "modPai_val_";

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

const dateFieldValidation = (req, availability, fieldName) => {
  const { oeuvreAvailability } = req.body;
  if (
    oeuvreAvailability === availability &&
    !isoDateRegExp.test(req.body[fieldName])
  ) {
    return false;
  }
  return true;
};

const giveKnownPersonObjOptions = (fieldName) => {
  const paintingAvailabilityRegex = new RegExp(
    `^${paintingAvailability[fieldName]}$`,
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

const oeuvreFileDefaultFileNameOptions = nullableStr(
  "oeuvreFileDefaultFileName",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const oeuvreFileDefaultFileExtensionOptions = nullableStr(
  "oeuvreFileDefaultFileExtension",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);

const oeuvreFileDeleteFileOptions = requiredBool(
  "oeuvreFileDefaultFile",
  errorMsgPrefix
);
const modifiedFieldsOptions = requiredObj("modifiedFields", errorMsgPrefix);
const modifiedFieldsElementOptions = requiredBool(
  "modifiedFields",
  errorMsgPrefix
);
const oeuvreTitleOptions = requiredStr("oeuvreTitle", errorMsgPrefix, {
  matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
  maxLength: 128,
});
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
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const oeuvreGivenToLastnameOptions = nullableStr(
  "oeuvreGivenToLastname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
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
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const oeuvreGivenToKnownPersonLastnameOptions = nullableStr(
  "oeuvreGivenToKnownPersonLastname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const giftDateOptions = {
  custom: {
    options: (value, { req }) => dateFieldValidation(req, 1, "giftDate"),
    errorMessage: `${errorMsgPrefix}GiftDate_dat`,
  },
};
const giftNoteOptions = nullableStr("giftNote", errorMsgPrefix, {
  matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
  maxLength: 254,
});
const oeuvreSoldToFirstnameOptions = nullableStr(
  "oeuvreSoldToFirstname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const oeuvreSoldToLastnameOptions = nullableStr(
  "oeuvreSoldToLastname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
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
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const oeuvreSoldToKnownPersonLastnameOptions = nullableStr(
  "oeuvreSoldToKnownPersonLastname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const saleDateOptions = {
  custom: {
    options: (value, { req }) => dateFieldValidation(req, 2, "saleDate"),
    errorMessage: `${errorMsgPrefix}SaleDate_dat`,
  },
};
const salePriceOptions = {
  custom: {
    options: (value, { req }) => {
      const { oeuvreAvailability, salePrice } = req.body;
      if (
        oeuvreAvailability === 2 &&
        !isPositiveNumber(parseInt(salePrice, 10))
      ) {
        return false;
      }
      return true;
    },
    errorMessage: `${errorMsgPrefix}SalePrice_price`,
  },
  toInt: true,
};
const saleNoteOptions = nullableStr("saleNote", errorMsgPrefix, {
  matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
  maxLength: 254,
});
const oeuvreReservedToFirstnameOptions = nullableStr(
  "oeuvreReservedToFirstname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const oeuvreReservedToLastnameOptions = nullableStr(
  "oeuvreReservedToLastname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
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
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const oeuvreReservedToKnownPersonLastnameOptions = nullableStr(
  "oeuvreReservedToKnownPersonLastname",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const reservationPriceOptions = nullableInt("reservationPrice", errorMsgPrefix);
const reservationDateOptions = {
  custom: {
    options: (value, { req }) => dateFieldValidation(req, 3, "reservationDate"),
    errorMessage: `${errorMsgPrefix}ReservationDate_dat`,
  },
};
const reservationNoteOptions = nullableStr("reservationNote", errorMsgPrefix, {
  matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
  maxLength: 254,
});
const artistCommentFrOptions = nullableStr("artistCommentFr", errorMsgPrefix, {
  matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
  maxLength: 254,
});

artistCommentFrOptions.exists = {
  if:
    body("artistCommentEnUS").isString().isLength({ min: 1 }) ||
    body("artistCommentEnGB").isString().isLength({ min: 1 }),
  errorMessage: `${errorMsgPrefix}artistCommentFr_exi`,
};
const artistCommentEnUSOptions = nullableStr(
  "artistCommentEnUS",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 254,
  }
);
const artistCommentEnGBOptions = nullableStr(
  "artistCommentEnGB",
  errorMsgPrefix,
  {
    matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" },
    maxLength: 254,
  }
);

const modifyPaintingSchema = checkSchema({
  "oeuvreFileDefaultFile.name": oeuvreFileDefaultFileNameOptions,
  "oeuvreFileDefaultFile.extension": oeuvreFileDefaultFileExtensionOptions,
  oeuvreFileDeleteFile: oeuvreFileDeleteFileOptions,
  modifiedFields: modifiedFieldsOptions,
  "modifiedFields.*": modifiedFieldsElementOptions,
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
  "oeuvreGivenToKnownPerson.lastname": oeuvreGivenToKnownPersonLastnameOptions,
  giftDate: giftDateOptions,
  giftNote: giftNoteOptions,
  oeuvreSoldToFirstname: oeuvreSoldToFirstnameOptions,
  oeuvreSoldToLastname: oeuvreSoldToLastnameOptions,
  oeuvreSoldToKnownPerson: oeuvreSoldToKnownPersonOptions,
  "oeuvreSoldToKnownPerson.userId": oeuvreSoldToKnownPersonUserIdOptions,
  "oeuvreSoldToKnownPerson.contactId": oeuvreSoldToKnownPersonContactIdOptions,
  "oeuvreSoldToKnownPerson.firstname": oeuvreSoldToKnownPersonFirstnameOptions,
  "oeuvreSoldToKnownPerson.lastname": oeuvreSoldToKnownPersonLastnameOptions,
  saleDate: saleDateOptions,
  salePrice: salePriceOptions,
  saleNote: saleNoteOptions,
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
  reservationDate: reservationDateOptions,
  reservationPrice: reservationPriceOptions,
  reservationNote: reservationNoteOptions,
  artistCommentFr: artistCommentFrOptions,
  artistCommentEnUS: artistCommentEnUSOptions,
  artistCommentEnGB: artistCommentEnGBOptions,
});

module.exports = modifyPaintingSchema;
