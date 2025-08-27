const asyncHandler = require("express-async-handler");
const { uppercaseFirstChar } = require("../../services/stringFunctions");

const addDeleteAttributeQueries = (attribute) => {
  return asyncHandler(async (req, res, next) => {
    const { body } = req;
    const detailedAttributeKey = `detailed${uppercaseFirstChar(attribute)}`;
    const detailedAtrribute = body[detailedAttributeKey];
    const { keyName, name } = detailedAtrribute;

    const nameFr = attribute === "family" ? name : detailedAtrribute.nameFr;

    const giveUndoQueriesArgs = (lang) => {
      const nameKeyName =
        attribute === "family" ? "name" : `name${uppercaseFirstChar(lang)}`;
      const descriptionKeyName = `description${uppercaseFirstChar(lang)}`;
      return {
        name: detailedAtrribute[nameKeyName],
        description: detailedAtrribute[descriptionKeyName] || "",
      };
    };

    const jsonQueriesArgs = {
      fr: giveUndoQueriesArgs("fr"),
      enUS: giveUndoQueriesArgs("enUS"),
      enGB: giveUndoQueriesArgs("enGB"),
    };

    body.deleteAttributeQueries = {
      jsonKeyName: keyName,
      nameFr,
      jsonQueriesArgs,
    };

    return next();
  });
};
module.exports = addDeleteAttributeQueries;
