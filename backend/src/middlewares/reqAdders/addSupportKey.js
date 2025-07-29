const expressAsyncHandler = require("express-async-handler");

const supportsFileFr = require("../../../public/locales/fr/supports.json");
const supportsFileEnUS = require("../../../public/locales/enUS/supports.json");
const supportsFileEnGB = require("../../../public/locales/enGB/supports.json");
const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");

const addSupportKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { supportsNameFr, supportsNameEnUS, supportsNameEnGB } = body;

  const languages = {
    fr: { file: supportsFileFr, name: supportsNameFr },
    enUS: { file: supportsFileEnUS, name: supportsNameEnUS },
    enGB: { file: supportsFileEnGB, name: supportsNameEnGB },
  };

  const { jsonKey, error } = giveJsonNewKeyOrError(languages, "05012");
  if (error) {
    return next(error);
  }
  body.supportKey = jsonKey;

  return next();
});

module.exports = addSupportKey;
