const asyncHandler = require("express-async-handler");

const addDeleteTechniqueQueries = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const {
    name,
    nameFr,
    nameEnUS,
    nameEnGB,
    descriptionFr,
    descriptionEnUS,
    descriptionEnGB,
  } = body.detailedTechnique;

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

  body.deleteTechniqueQueries = {
    jsonKeyName,
    nameFr,
    jsonQueriesArgs,
  };

  return next();
});

module.exports = addDeleteTechniqueQueries;
