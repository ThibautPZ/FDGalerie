const { checkSchema } = require("express-validator");
const {
  requiredStr,
  nullableStr,
  requiredBool,
  requiredObj,
} = require("./schemaOptions");

const errorMsgPrefix = "modTec_val_";

const modifiedFieldsOptions = requiredObj("modifiedFields", errorMsgPrefix);
const modifiedFieldsElementOptions = requiredBool(
  "modifiedFields",
  errorMsgPrefix
);
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
  modifiedFields: modifiedFieldsOptions,
  "modifiedFields.*": modifiedFieldsElementOptions,
  techniqueNameFr: techniqueNameFrOptions,
  techniqueNameEnGB: techniqueNameEnGBOptions,
  techniqueNameEnUS: techniqueNameEnUSOptions,
  techniqueDescriptionFr: techniqueDescriptionFrOptions,
  techniqueDescriptionEnGB: techniqueDescriptionEnGBOptions,
  techniqueDescriptionEnUS: techniqueDescriptionEnUSOptions,
});

module.exports = createTechniqueSchema;
