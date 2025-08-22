const asyncHandler = require("express-async-handler");
const {
  lowercaseFirstChar,
  uppercaseFirstChar,
} = require("../../services/stringFunctions");
const { isObjectNotEmpty } = require("../../services/typesAndValidationChecks");

const keys = ["Name", "Description"];

const giveLanguageAndKey = (modifiedFieldName) => {
  for (const key of keys) {
    const splitName = modifiedFieldName.split(key);
    if (splitName.length === 2) {
      return { language: lowercaseFirstChar(splitName[1]), key };
    }
  }
  return {};
};

const addModifyTechniqueQueries = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const { modifiedFields, detailedTechnique } = body;
  const { name } = detailedTechnique;

  const queriesArgs = {
    fr: {},
    enUS: {},
    enGB: {},
  };

  for (const fieldName of Object.keys(modifiedFields)) {
    const { language, key } = giveLanguageAndKey(fieldName);
    queriesArgs[language][key] = body[fieldName];
  }

  const giveReferenceValues = (lang) => {
    const nameKey = `name${uppercaseFirstChar(lang)}`;
    const descriptionKey = `description${uppercaseFirstChar(lang)}`;
    return {
      name: detailedTechnique[nameKey],
      description: detailedTechnique[descriptionKey],
    };
  };

  const modifyTechniqueQueries = {};
  for (const [langKey, args] of Object.entries(queriesArgs)) {
    if (isObjectNotEmpty(args)) {
      const referenceValues = giveReferenceValues(langKey);
      modifyTechniqueQueries[langKey] = {
        queries: {
          name: args.Name ?? referenceValues.name,
          description: args.Description ?? referenceValues.description,
        },
        undoQueries: referenceValues,
      };
    }
  }

  body.techniqueKey = name;
  body.modifyTechniqueQueries = modifyTechniqueQueries;

  return next();
});

module.exports = addModifyTechniqueQueries;
