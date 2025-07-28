const { checkSchema } = require("express-validator");
const { requiredStr, nullableStr } = require("./schemaOptions");

const errorMsgPrefix = "creFam_val_";

const familyNameOptions = requiredStr("familyName", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const familyDescriptionOptions = nullableStr(
  "familyDescription",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const createFamilySchema = checkSchema({
  familyName: familyNameOptions,
  familyDescription: familyDescriptionOptions,
});

module.exports = createFamilySchema;
