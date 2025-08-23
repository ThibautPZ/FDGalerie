const asyncHandler = require("express-async-handler");
const { uppercaseFirstChar } = require("../../services/stringFunctions");

const addDeleteAttributeQueries = (attribute) => {
  return asyncHandler(async (req, res, next) => {
    const { body } = req;
    const detailedAttributeKey = `detailed${uppercaseFirstChar(attribute)}`;
    const {
      name,
      nameFr,
      nameEnUS,
      nameEnGB,
      descriptionFr,
      descriptionEnUS,
      descriptionEnGB,
    } = body[detailedAttributeKey];

    const jsonKeyName = name;

    const jsonFrUndoQueriesArgs = {
      name: nameFr,
      description: descriptionFr || "",
    };

    const jsonEnUSUndoQueriesArgs = {
      name: nameEnUS,
      description: descriptionEnUS || "",
    };

    const jsonEnGBUndoQueriesArgs = {
      name: nameEnGB,
      description: descriptionEnGB || "",
    };

    const jsonQueriesArgs = {
      fr: jsonFrUndoQueriesArgs,
      enUS: jsonEnUSUndoQueriesArgs,
      enGB: jsonEnGBUndoQueriesArgs,
    };

    body.deleteAttributeQueries = {
      jsonKeyName,
      nameFr,
      jsonQueriesArgs,
    };

    return next();
  });
};
module.exports = addDeleteAttributeQueries;
