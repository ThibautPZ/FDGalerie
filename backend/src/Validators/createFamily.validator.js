const { checkSchema } = require("express-validator");
const { requiredStr, nullableStr } = require("./schemaOptions");

const errorMsgPrefix = "creFam_val_";

const familyNameOptions = requiredStr("familyName", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const familyDescriptionFrOptions = nullableStr(
  "familyDescriptionFr",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const familyDescriptionEnUSOptions = nullableStr(
  "familyDescriptionEnUS",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const familyDescriptionEnGBOptions = nullableStr(
  "familyDescriptionEnGB",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const createFamilySchema = checkSchema({
  familyName: familyNameOptions,
  familyDescriptionFr: familyDescriptionFrOptions,
  familyDescriptionEnUS: familyDescriptionEnUSOptions,
  familyDescriptionEnGB: familyDescriptionEnGBOptions,
});

module.exports = createFamilySchema;
