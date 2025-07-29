const { checkSchema } = require("express-validator");
const { requiredStr, nullableStr } = require("./schemaOptions");

const errorMsgPrefix = "creSup_val_";

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
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const supportDescriptionEnUSOptions = nullableStr(
  "supportDescriptionEnUS",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const supportDescriptionEnGBOptions = nullableStr(
  "supportDescriptionEnGB",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const createSupportSchema = checkSchema({
  supportNameFr: supportNameFrOptions,
  supportNameEnUS: supportNameEnUSOptions,
  supportNameEnGB: supportNameEnGBOptions,
  supportDescriptionFr: supportDescriptionFrOptions,
  supportDescriptionEnUS: supportDescriptionEnUSOptions,
  supportDescriptionEnGB: supportDescriptionEnGBOptions,
});

module.exports = createSupportSchema;
