const path = require("node:path");
const async = require("async");
const expressAsyncHandler = require("express-async-handler");

const readJsonFile = require("../../services/fileSystem/readJsonFile");
const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");

const addTechniqueKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { techniqueNameFr, techniqueNameEnUS, techniqueNameEnGB } = body;

  const givePath = (language) =>
    path.join(__dirname, `../../../public/locales/${language}/techniques.json`);
  const readJson = async.retryable(5, readJsonFile);
  const techniquesFileFr = readJson(givePath("fr"));
  const techniquesFileEnUS = readJson(givePath("enUS"));
  const techniquesFileEnGB = readJson(givePath("enGB"));

  const languages = {
    fr: { file: techniquesFileFr, name: techniqueNameFr },
    enUS: { file: techniquesFileEnUS, name: techniqueNameEnUS },
    enGB: { file: techniquesFileEnGB, name: techniqueNameEnGB },
  };

  const { jsonKey, error } = giveJsonNewKeyOrError(languages, "05005");
  if (error) {
    return next(error);
  }
  body.techniqueKey = jsonKey;
  return next();
});
module.exports = addTechniqueKey;
