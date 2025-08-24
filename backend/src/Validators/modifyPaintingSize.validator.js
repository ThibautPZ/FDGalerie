const { checkSchema } = require("express-validator");
const {
  requiredStr,
  nullableStr,
  requiredObj,
  requiredBool,
} = require("./schemaOptions");

const errorMsgPrefix = "modPaiSiz_val_";

const modifiedFieldsOptions = requiredObj("modifiedFields", errorMsgPrefix);
const modifiedFieldsElementOptions = requiredBool(
  "modifiedFields",
  errorMsgPrefix
);

const paintingSizeNameFrOptions = requiredStr(
  "paintingSizeNameFr",
  errorMsgPrefix,
  {
    matches: { regexName: "minOneNonSpaceCharRegExp" },
    maxLength: 64,
  }
);
const paintingSizeNameEnUSOptions = requiredStr(
  "paintingSizeNameEnUS",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 64 }
);
const paintingSizeNameEnGBOptions = requiredStr(
  "paintingSizeNameEnGB",
  errorMsgPrefix,
  { matches: { regexName: "minOneNonSpaceCharRegExp" }, maxLength: 64 }
);
const paintingSizeDescriptionFrOptions = nullableStr(
  "paintingSizeDescriptionFr",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const paintingSizeDescriptionEnUSOptions = nullableStr(
  "paintingSizeDescriptionEnUS",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);
const paintingSizeDescriptionEnGBOptions = nullableStr(
  "paintingSizeDescriptionEnGB",
  errorMsgPrefix,
  { matches: { regexName: "emptyOrMinOneNonSpaceCharRegExp" }, maxLength: 8000 }
);

const createPaintingSizeSchema = checkSchema({
  modifiedFields: modifiedFieldsOptions,
  "modifiedFields.*": modifiedFieldsElementOptions,
  paintingSizeNameFr: paintingSizeNameFrOptions,
  paintingSizeNameEnUS: paintingSizeNameEnUSOptions,
  paintingSizeNameEnGB: paintingSizeNameEnGBOptions,
  paintingSizeDescriptionFr: paintingSizeDescriptionFrOptions,
  paintingSizeDescriptionEnUS: paintingSizeDescriptionEnUSOptions,
  paintingSizeDescriptionEnGB: paintingSizeDescriptionEnGBOptions,
});

module.exports = createPaintingSizeSchema;
