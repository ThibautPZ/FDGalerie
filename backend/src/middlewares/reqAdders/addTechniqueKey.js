const expressAsyncHandler = require("express-async-handler");

const techniquesFileFr = require("../../../public/locales/fr/techniques.json");
const techniquesFileEnUS = require("../../../public/locales/enUS/techniques.json");
const techniquesFileEnGB = require("../../../public/locales/enGB/techniques.json");
const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");

const addTechniqueKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { techniqueNameFr, techniqueNameEnUS, techniqueNameEnGB } = body;

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
