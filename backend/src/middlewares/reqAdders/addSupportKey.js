const path = require("node:path");
const async = require("async");
const expressAsyncHandler = require("express-async-handler");

const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");
const readJsonFile = require("../../services/fileSystem/readJsonFile");

const addSupportKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { supportNameFr, supportNameEnUS, supportNameEnGB } = body;

  const givePath = (language) =>
    path.join(__dirname, `../../../public/locales/${language}/supports.json`);

  const readJson = async.retryable(5, readJsonFile);

  const supportFileFr = readJson(givePath("fr"));
  const supportFileEnUS = readJson(givePath("enUS"));
  const supportFileEnGB = readJson(givePath("enGB"));

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
