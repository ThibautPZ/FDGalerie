const { uppercaseFirstChar } = require("../services/stringFunctions");

const requiredStr = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `missing${uppercasedFieldName}` },

    isString: {
      errorMessage: `wrong${uppercasedFieldName}`,
    },
    isLength: {
      errorMessage: `missing${uppercasedFieldName}`,
      options: { min: 1 },
    },
    trim: true,
    escape: true,
    // matches: {
    //   pattern: /^([^\p{N}\p{S}\p{C}\\\/]{2,20})$/,
    //   errorMessage: "wrongTextPattern",
    // },
  };
};

const requiredArr = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `missing${uppercasedFieldName}` },
    isArray: {
      errorMessage: `wrong${uppercasedFieldName}`,
    },
    isLength: {
      errorMessage: `wrong${uppercasedFieldName}`,
      options: { min: 1 },
    },
  };
};

const requiredInt = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `missing${uppercasedFieldName}` },
    isInt: {
      errorMessage: `wrong${uppercasedFieldName}`,
    },
    toInt: true,
  };
};

const requiredFloat = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `missing${uppercasedFieldName}` },
    isFloat: {
      errorMessage: `wrong${uppercasedFieldName}`,
    },
    toFloat: true,
  };
};

const nullableStr = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    optional: { options: { values: null } },
    isString: { errorMessage: `wrong${uppercasedFieldName}` },
    trim: true,
    escape: true,
  };
};

const nullableInt = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    optional: { options: { values: null } },
    isInt: { errorMessage: `wrong${uppercasedFieldName}` },
    toInt: true,
  };
};

const undefinableObj = (fieldName) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  const returnedObj = {
    optional: { options: { values: undefined } },
    isObject: { errorMessage: `wrong${uppercasedFieldName}` },
  };
  return returnedObj;
};

module.exports = {
  requiredStr,
  requiredArr,
  requiredInt,
  requiredFloat,
  nullableStr,
  nullableInt,
  undefinableObj,
};
