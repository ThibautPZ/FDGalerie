const path = require("node:path");
const async = require("async");
const expressAsyncHandler = require("express-async-handler");

const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");
const readJsonFile = require("../../services/fileSystem/readJsonFile");

const addFamilyKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { familyName } = body;
  const givePath = (language) =>
    path.join(__dirname, `../../../public/locales/${language}/families.json`);
  const readJson = async.retryable(5, readJsonFile);

  const familiesFileFr = readJson(givePath("fr"));
  const familiesFileEnUS = readJson(givePath("enUS"));
  const familiesFileEnGB = readJson(givePath("enGB"));

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
