const { checkSchema } = require("express-validator");
const {
  requiredStr,
  nullableStr,
  requiredObj,
  requiredBool,
} = require("./schemaOptions");

const errorMsgPrefix = "modSup_val_";

const modifiedFieldsOptions = requiredObj("modifiedFields", errorMsgPrefix);
const modifiedFieldsElementOptions = requiredBool(
  "modifiedFields",
  errorMsgPrefix
);
const supportNameFrOptions = requiredStr("supportNameFr", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const supportNameEnUSOptions = requiredStr("supportNameEnUS", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const supportNameEnGBOptions = requiredStr("supportNameEnGB", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const supportDescriptionFrOptions = nullableStr(
  "supportDescriptionFr",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const supportDescriptionEnUSOptions = nullableStr(
  "supportDescriptionEnUS",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const supportDescriptionEnGBOptions = nullableStr(
  "supportDescriptionEnGB",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const createSupportSchema = checkSchema({
  modifiedFields: modifiedFieldsOptions,
  "modifiedFields.*": modifiedFieldsElementOptions,
  supportNameFr: supportNameFrOptions,
  supportNameEnUS: supportNameEnUSOptions,
  supportNameEnGB: supportNameEnGBOptions,
  supportDescriptionFr: supportDescriptionFrOptions,
  supportDescriptionEnUS: supportDescriptionEnUSOptions,
  supportDescriptionEnGB: supportDescriptionEnGBOptions,
});

module.exports = createSupportSchema;
