const expressAsyncHandler = require("express-async-handler");

const supportFileFr = require("../../../public/locales/fr/supports.json");
const supportFileEnUS = require("../../../public/locales/enUS/supports.json");
const supportFileEnGB = require("../../../public/locales/enGB/supports.json");
const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");

const addSupportKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { supportNameFr, supportNameEnUS, supportNameEnGB } = body;

  const languages = {
    fr: { file: supportFileFr, name: supportNameFr },
    enUS: { file: supportFileEnUS, name: supportNameEnUS },
    enGB: { file: supportFileEnGB, name: supportNameEnGB },
  };

  const { jsonKey, error } = giveJsonNewKeyOrError(languages, "05012");
  if (error) {
    return next(error);
  }
  body.supportKey = jsonKey;

  return next();
});

module.exports = addSupportKey;
