const { checkSchema } = require("express-validator");
const { requiredStr, nullableStr } = require("./schemaOptions");

const errorMsgPrefix = "creTec_val_";

const techniqueNameFrOptions = requiredStr("techniqueNameFr", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const techniqueNameEnUSOptions = requiredStr(
  "techniqueNameEnUS",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 64 }
);
const techniqueNameEnGBOptions = requiredStr(
  "techniqueNameEnGB",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 64 }
);
const techniqueDescriptionFrOptions = nullableStr(
  "techniqueDescriptionFr",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const techniqueDescriptionEnUSOptions = nullableStr(
  "techniqueDescriptionEnUS",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const techniqueDescriptionEnGBOptions = nullableStr(
  "techniqueDescriptionEnGB",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const createTechniqueSchema = checkSchema({
  techniqueNameFr: techniqueNameFrOptions,
  techniqueNameEnGB: techniqueNameEnGBOptions,
  techniqueNameEnUS: techniqueNameEnUSOptions,
  techniqueDescriptionFr: techniqueDescriptionFrOptions,
  techniqueDescriptionEnGB: techniqueDescriptionEnGBOptions,
  techniqueDescriptionEnUS: techniqueDescriptionEnUSOptions,
});

module.exports = createTechniqueSchema;
