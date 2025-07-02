const expressAsyncHandler = require("express-async-handler");
const { iterateObj } = require("../services/objectFunctions");

const convertKeysToColumns = (schema, inMap = false) => {
  const convertBodyKeys = (key, value, obj) => {
    const objToMutate = obj;
    delete objToMutate[key];
    if (value !== "") {
      const convertedKey = schema[key] || key;
      Object.assign(objToMutate, { [convertedKey]: value });
    }
  };

  return expressAsyncHandler(async (req, res, next) => {
    const { body } = req;

    if (inMap) {
      const convertedEntries = new Map();
      const convertBodyKeysToMap = (key, value, obj) => {
        const objToMutate = obj;
        delete objToMutate[key];

        if (value !== "") {
          const convertedKey = schema[key] || key;
          convertedEntries.set(convertedKey, value);
        }
      };

      iterateObj(body, convertBodyKeysToMap);

      Object.defineProperty(body, "convertedEntries", {
        value: convertedEntries,
        configurable: true,
        enumerable: true,
      });

      return next();
    }

    iterateObj(body, convertBodyKeys);

    return next();
  });
};

module.exports = convertKeysToColumns;
