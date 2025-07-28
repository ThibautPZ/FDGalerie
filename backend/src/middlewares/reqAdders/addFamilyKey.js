const expressAsyncHandler = require("express-async-handler");

const familiesFileFr = require("../../../public/locales/fr/families.json");
const familiesFileEnUS = require("../../../public/locales/enUS/families.json");
const familiesFileEnGB = require("../../../public/locales/enGB/families.json");
const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");

const addFamilyKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { familyName } = body;

  const languages = {
    fr: { file: familiesFileFr, name: familyName },
    enUS: { file: familiesFileEnUS, name: familyName },
    enGB: { file: familiesFileEnGB, name: familyName },
  };

  const { jsonKey, error } = giveJsonNewKeyOrError(languages, "05010");
  if (error) {
    return next(error);
  }
  body.familyKey = jsonKey;
  return next();
});
module.exports = addFamilyKey;
