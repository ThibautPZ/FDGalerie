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
      return {
        language: lowercaseFirstChar(splitName[1]),
        key: lowercaseFirstChar(key),
      };
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
    const { keyName } = detailedAttribute;

    const queriesArgs = {
      fr: {},
      enUS: {},
      enGB: {},
    };

    for (const fieldName of Object.keys(modifiedFields)) {
      const { language, key } = giveLanguageAndKey(fieldName);
      if (attribute === "family" && key === "name") {
        queriesArgs.fr.name = body[fieldName];
        queriesArgs.enUS.name = body[fieldName];
        queriesArgs.enGB.name = body[fieldName];
      } else {
        queriesArgs[language][key] = body[fieldName];
      }
    }

    const giveReferenceValues = (lang) => {
      const nameKey =
        attribute === "family" ? `name` : `name${uppercaseFirstChar(lang)}`;
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
            name: args.name ?? referenceValues.name,
            description: args.description ?? referenceValues.description,
          },
          undoQueries: referenceValues,
        };
      }
    }

    body.jsonKey = keyName;
    body.modifyAttributeQueries = modifyAttributeQueries;

    return next();
  });
};

module.exports = addModifyAttributeQueries;
