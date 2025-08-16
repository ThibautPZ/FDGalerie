const { checkSchema } = require("express-validator");
const { requiredStr } = require("./schemaOptions");

const errorMsgPrefix = "seaUseAndConByName_val_";

const firstnameOptions = requiredStr("firstname", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});
const lastnameOptions = requiredStr("lastname", errorMsgPrefix, {
  matches: { regexName: "minOneNonSpaceCharRegExp" },
  maxLength: 64,
});

const searchUsersAndContactsByNameSchema = checkSchema(
  {
    firstname: firstnameOptions,
    lastname: lastnameOptions,
  },
  ["params"]
);

module.exports = searchUsersAndContactsByNameSchema;
