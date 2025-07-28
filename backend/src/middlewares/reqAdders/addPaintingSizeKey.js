const expressAsyncHandler = require("express-async-handler");

const paintingSizesFileFr = require("../../../public/locales/fr/paintingSizes.json");
const paintingSizesFileEnUS = require("../../../public/locales/enUS/paintingSizes.json");
const paintingSizesFileEnGB = require("../../../public/locales/enGB/paintingSizes.json");
const giveJsonNewKeyOrError = require("../../services/giveJsonNewKeyOrError");

const addPaintingSizeKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { paintingSizeNameFr, paintingSizeNameEnUS, paintingSizeNameEnGB } =
    body;

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
