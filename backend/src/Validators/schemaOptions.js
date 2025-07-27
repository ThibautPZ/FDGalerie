const { uppercaseFirstChar } = require("../services/stringFunctions");
const { isNumber } = require("../services/typesAndValidationChecks");
const regularExpressions = require("../services/regularExpressions");

const giveLengthOptions = (isFieldRequired, options = {}) => {
  const { minLength, maxLength } = options;
  const lengthOptions = {};
  const min = isFieldRequired && !minLength ? 1 : minLength;
  if (isNumber(min)) {
    Object.assign(lengthOptions, { min });
  }
  if (isNumber(maxLength)) {
    Object.assign(lengthOptions, { max: maxLength });
  }
  return lengthOptions;
};

const requiredStr = (fieldName, errMsgPrefix, options) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  const returnedObj = {
    exists: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_exi` },

    isString: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isStr`,
    },
    isLength: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isLen`,
      options: giveLengthOptions(true, options),
    },
    trim: true,
    escape: true,
  };
  if (options?.matches) {
    const regex =
      regularExpressions[options.matches.regexName] ||
      regularExpressions.minOneNonSpaceCharRegExp;
    Object.assign(returnedObj, {
      matches: {
        options: regex,
        errorMessage: `${errMsgPrefix}${uppercasedFieldName}_pat`,
      },
    });
  }

  return returnedObj;
};

const requiredArr = (fieldName, errMsgPrefix, options) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_exi` },
    isArray: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isArr`,
    },
    isLength: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isLen`,
      options: giveLengthOptions(true, options),
    },
  };
};

const requiredInt = (fieldName, errMsgPrefix) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_exi` },
    isInt: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isInt`,
    },
    toInt: true,
  };
};

const requiredFloat = (fieldName, errMsgPrefix) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_exi` },
    isFloat: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isFlo`,
    },
    toFloat: true,
  };
};

const nullableStr = (fieldName, errMsgPrefix, options) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  const returnedObj = {
    optional: { options: { values: null } },
    isString: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isStr` },
    isLength: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isLen`,
      options: giveLengthOptions(false, options),
    },
    trim: true,
    escape: true,
  };
  if (options?.matches) {
    const regex =
      regularExpressions[options.matches.regexName] ||
      regularExpressions.minOneNonSpaceCharRegExp;
    Object.assign(returnedObj, {
      matches: {
        pattern: regex,
        errorMessage: `${errMsgPrefix}${uppercasedFieldName}_pat`,
      },
    });
  }
  return returnedObj;
};

const nullableInt = (fieldName, errMsgPrefix) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    optional: { options: { values: null } },
    isInt: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isInt` },
    toInt: true,
  };
};

const undefinableObj = (fieldName, errMsgPrefix) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  const returnedObj = {
    optional: { options: { values: undefined } },
    isObject: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isObj` },
  };
  return returnedObj;
};

const requiredBool = (fieldName, errMsgPrefix) => {
  const uppercasedFieldName = uppercaseFirstChar(fieldName);
  return {
    exists: { errorMessage: `${errMsgPrefix}${uppercasedFieldName}_exi` },
    isBoolean: {
      errorMessage: `${errMsgPrefix}${uppercasedFieldName}_isBoo`,
    },
    toBoolean: true,
  };
};

module.exports = {
  requiredStr,
  requiredArr,
  requiredInt,
  requiredFloat,
  nullableStr,
  nullableInt,
  undefinableObj,
  requiredBool,
};
