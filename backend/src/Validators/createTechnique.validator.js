const { checkSchema } = require("express-validator");
const { requiredStr } = require("./schemaOptions");

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

const createTechniqueSchema = checkSchema({
  techniqueNameFr: techniqueNameFrOptions,
  techniqueNameEnGB: techniqueNameEnGBOptions,
  techniqueNameEnUS: techniqueNameEnUSOptions,
});

module.exports = createTechniqueSchema;
