const { checkSchema } = require("express-validator");
const {
  requiredStr,
  nullableStr,
  requiredObj,
  requiredBool,
} = require("./schemaOptions");

const errorMsgPrefix = "creFam_val_";

const modifiedFieldsOptions = requiredObj("modifiedFields", errorMsgPrefix);
const modifiedFieldsElementOptions = requiredBool(
  "modifiedFields",
  errorMsgPrefix
);

const familyNameOptions = requiredStr("familyName", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const familyDescriptionFrOptions = nullableStr(
  "familyDescriptionFr",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const familyDescriptionEnUSOptions = nullableStr(
  "familyDescriptionEnUS",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const familyDescriptionEnGBOptions = nullableStr(
  "familyDescriptionEnGB",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const createFamilySchema = checkSchema({
  modifiedFields: modifiedFieldsOptions,
  "modifiedFields.*": modifiedFieldsElementOptions,
  familyName: familyNameOptions,
  familyDescriptionFr: familyDescriptionFrOptions,
  familyDescriptionEnUS: familyDescriptionEnUSOptions,
  familyDescriptionEnGB: familyDescriptionEnGBOptions,
});

module.exports = createFamilySchema;
