const path = require("node:path");
const async = require("async");
const expressAsyncHandler = require("express-async-handler");

const readJsonFile = require("../../services/fileSystem/readJsonFile");
const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");

const addPaintingSizeKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { paintingSizeNameFr, paintingSizeNameEnUS, paintingSizeNameEnGB } =
    body;

  const givePath = (language) =>
    path.join(
      __dirname,
      `../../../public/locales/${language}/paintingSizes.json`
    );
  const readJson = async.retryable(5, readJsonFile);
  const paintingSizesFileFr = readJson(givePath("fr"));
  const paintingSizesFileEnUS = readJson(givePath("enUS"));
  const paintingSizesFileEnGB = readJson(givePath("enGB"));

  const languages = {
    fr: { file: paintingSizesFileFr, name: paintingSizeNameFr },
    enUS: { file: paintingSizesFileEnUS, name: paintingSizeNameEnUS },
    enGB: { file: paintingSizesFileEnGB, name: paintingSizeNameEnGB },
  };

  const { jsonKey, error } = giveJsonNewKeyOrError(languages, "05011");
  if (error) {
    return next(error);
  }
  body.paintingSizeKey = jsonKey;
  return next();
});

module.exports = addPaintingSizeKey;
