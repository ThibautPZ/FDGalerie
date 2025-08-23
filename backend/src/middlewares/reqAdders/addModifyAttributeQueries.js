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

const addModifyAttributeQueries = (attribute) => {
  return asyncHandler(async (req, res, next) => {
    const { body } = req;
    const { modifiedFields } = body;
    const detailedAttributeKey = `detailed${uppercaseFirstChar(attribute)}`;
    const detailedAttribute = body[detailedAttributeKey];
    const { name } = detailedAttribute;

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
        name: detailedAttribute[nameKey],
        description: detailedAttribute[descriptionKey],
      };
    };

    const modifyAttributeQueries = {};
    for (const [langKey, args] of Object.entries(queriesArgs)) {
      if (isObjectNotEmpty(args)) {
        const referenceValues = giveReferenceValues(langKey);
        modifyAttributeQueries[langKey] = {
          queries: {
            name: args.Name ?? referenceValues.name,
            description: args.Description ?? referenceValues.description,
          },
          undoQueries: referenceValues,
        };
      }
    }

    body.jsonKey = name;
    body.modifyAttributeQueries = modifyAttributeQueries;

    return next();
  });
};

module.exports = addModifyAttributeQueries;
