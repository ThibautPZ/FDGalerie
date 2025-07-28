const expressAsyncHandler = require("express-async-handler");
const { caseToUpperCase } = require("../../services/stringFunctions");
const CustomErrorClass = require("../../services/ErrorClasses");

const techniquesFileFr = require("../../../public/locales/fr/techniques.json");
const techniquesFileEnUS = require("../../../public/locales/enUS/techniques.json");
const techniquesFileEnGB = require("../../../public/locales/enGB/techniques.json");

const addTechniqueKey = expressAsyncHandler(async (req, res, next) => {
  const { body } = req;
  const { techniqueNameFr, techniqueNameEnUS, techniqueNameEnGB } = body;

  const languages = {
    fr: { file: techniquesFileFr, name: techniqueNameFr },
    enUS: { file: techniquesFileEnUS, name: techniqueNameEnUS },
    enGB: { file: techniquesFileEnGB, name: techniqueNameEnGB },
  };

  const giveTechniqueKeyOrErr = () => {
    for (const [key, { file, name }] of Object.entries(languages)) {
      const techniqueKey = caseToUpperCase(name);
      if (file[techniqueKey]?.name === name) {
        const err = new CustomErrorClass("05005", key);
        return { techniqueKey: "", error: err };
      }
      if (!file[techniqueKey]) {
        return { techniqueKey, error: null };
      }
    }
    const err = new CustomErrorClass("05005");
    return { techniqueKey: "", error: err };
  };

  const { techniqueKey, error } = giveTechniqueKeyOrErr();
  if (error) {
    return next(error);
  }
  body.techniqueKey = techniqueKey;
  return next();
});
module.exports = addTechniqueKey;
